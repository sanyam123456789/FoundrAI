import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.credential import GoogleCredential
from app.utils.encryption import encrypt_token
import google_auth_oauthlib.flow
import googleapiclient.discovery

logger = logging.getLogger("app.api.v1.integrations")

router = APIRouter(prefix="/integrations/google", tags=["google-integrations"])

# OAuth Scopes required for email read-only access and getting profile email info
SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid"
]


import hmac
import hashlib

def sign_oauth_state(user_id: str, code_verifier: str) -> str:
    """
    Signs the state parameter with a hash signature to prevent CSRF and parameter tampering.
    """
    secret = settings.GOOGLE_CLIENT_SECRET or settings.GROQ_API_KEY or "foundrai_secure_hmac_secret"
    payload = f"{user_id}:{code_verifier}"
    signature = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}:{signature}"


def verify_oauth_state(state: str) -> tuple[str, str]:
    """
    Verifies state signature and extracts user_id and code_verifier.
    Raises ValueError if validation fails.
    """
    parts = state.split(":")
    if len(parts) != 3:
        raise ValueError("Malformed state parameter format.")
    
    user_id, code_verifier, signature = parts
    secret = settings.GOOGLE_CLIENT_SECRET or settings.GROQ_API_KEY or "foundrai_secure_hmac_secret"
    payload = f"{user_id}:{code_verifier}"
    expected_sig = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    
    if not hmac.compare_digest(signature, expected_sig):
        raise ValueError("State signature verification failed. CSRF attempt blocked.")
        
    return user_id, code_verifier


def get_oauth_flow(state: str = None) -> google_auth_oauthlib.flow.Flow:
    """
    Builds the Google OAuth Flow using backend settings credentials.
    """
    flow = google_auth_oauthlib.flow.Flow.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.GOOGLE_REDIRECT_URI]
            }
        },
        scopes=SCOPES,
        state=state
    )
    flow.redirect_uri = settings.GOOGLE_REDIRECT_URI
    return flow


@router.get("/auth-url")
def get_auth_url(user_id: str = Query(..., description="The Clerk user ID to connect.")):
    """
    Returns the Google OAuth authorization URL, passing the user_id and signed PKCE code_verifier.
    """
    if not user_id or not user_id.startswith("user_"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or missing user ID context. Access denied."
        )

    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google OAuth is not configured on the backend. Please check your environment configuration."
        )
    try:
        flow = get_oauth_flow()
        # Trigger authorization_url once to generate flow.code_verifier internally
        flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            prompt="consent"
        )
        code_verifier = flow.code_verifier
        
        # State payload packages user_id, code_verifier, and HMAC signature
        state_payload = sign_oauth_state(user_id, code_verifier)
        
        # Generate the final authorization URL with the combined state payload
        auth_url, _ = flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            prompt="consent",
            state=state_payload
        )
        return {"url": auth_url}
    except Exception as e:
        logger.error(f"Error generating OAuth URL: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate authorization URL: {str(e)}"
        )


@router.get("/callback")
def oauth_callback(
    code: str = None,
    state: str = None,
    error: str = None,
    db: Session = Depends(get_db)
):
    """
    Google OAuth redirect callback endpoint.
    Retrieves OAuth code, queries Google for profile email, encrypts tokens, and saves credentials.
    Redirects user back to Next.js dashboard Settings page with connection query flags.
    """
    frontend_settings_url = "http://localhost:3000/settings"

    if error:
        logger.warning(f"Google OAuth callback returned error: {error}")
        return RedirectResponse(url=f"{frontend_settings_url}?error=OAuth+cancelled")

    if not code or not state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid callback payload: missing auth code or state state parameter."
        )

    try:
        # Extract and verify user_id and code_verifier from the signed state parameter
        user_id, code_verifier = verify_oauth_state(state)
        
        # Additional safety check on verified user ID
        if not user_id.startswith("user_"):
            raise ValueError("State payload contains invalid user ID prefix.")

        flow = get_oauth_flow(state=state)
        # Fetch token passing the original code_verifier to satisfy Google's PKCE verification
        flow.fetch_token(code=code, code_verifier=code_verifier)
        credentials = flow.credentials

        # Query user profile email address
        service = googleapiclient.discovery.build("oauth2", "v2", credentials=credentials)
        user_info = service.userinfo().get().execute()
        email = user_info.get("email")

        if not email:
            raise ValueError("Failed to retrieve user email from Google Profile API.")

        # Encrypt access and refresh tokens
        enc_access = encrypt_token(credentials.token)
        enc_refresh = encrypt_token(credentials.refresh_token) if credentials.refresh_token else None

        # Check if record already exists for the current user ID
        db_credential = db.query(GoogleCredential).filter(GoogleCredential.user_id == user_id).first()
        if db_credential:
            db_credential.email = email
            db_credential.access_token = enc_access
            if enc_refresh:
                db_credential.refresh_token = enc_refresh
            db_credential.expires_at = credentials.expiry
        else:
            db_credential = GoogleCredential(
                user_id=user_id,
                email=email,
                access_token=enc_access,
                refresh_token=enc_refresh,
                token_uri=credentials.token_uri,
                client_id=credentials.client_id,
                client_secret=credentials.client_secret,
                scopes=",".join(credentials.scopes),
                expires_at=credentials.expiry
            )
            db.add(db_credential)

        db.commit()
        logger.info(f"Successfully saved Google credentials for user: {user_id}")
        return RedirectResponse(url=f"{frontend_settings_url}?connected=true")

    except Exception as e:
        logger.error(f"OAuth Callback processing failed: {e}")
        return RedirectResponse(url=f"{frontend_settings_url}?error=Authentication+failed:+{str(e)}")


@router.get("/status")
def get_status(
    user_id: str = Query(..., description="The Clerk user ID."),
    db: Session = Depends(get_db)
):
    """
    Checks connection state status of Gmail integration for a user.
    """
    if not user_id or not user_id.startswith("user_"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or missing user ID context. Access denied."
        )

    db_credential = db.query(GoogleCredential).filter(GoogleCredential.user_id == user_id).first()
    if not db_credential:
        return {"connected": False, "email": None}
    return {"connected": True, "email": db_credential.email}


@router.post("/disconnect")
def disconnect_google(
    user_id: str = Query(..., description="The Clerk user ID to disconnect."),
    db: Session = Depends(get_db)
):
    """
    Disconnects the Google/Gmail integration for the user by deleting stored database credentials.
    """
    if not user_id or not user_id.startswith("user_"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or missing user ID context. Access denied."
        )

    db_credential = db.query(GoogleCredential).filter(GoogleCredential.user_id == user_id).first()
    if not db_credential:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No connected Google account found for this user."
        )

    db.delete(db_credential)
    db.commit()
    logger.info(f"Disconnected Google account for user: {user_id}")
    return {"success": True, "message": "Google Integration disconnected successfully."}
