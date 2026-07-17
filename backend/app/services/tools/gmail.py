import logging
import base64
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.services.tools.base import BaseTool
from app.config import settings
from app.database.session import SessionLocal
from app.models.credential import GoogleCredential
from app.utils.encryption import decrypt_token, encrypt_token
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import googleapiclient.discovery
import googleapiclient.errors

logger = logging.getLogger("app.services.tools.gmail")


class GmailTool(BaseTool):
    """
    Gmail Tool connecting to Google APIs.
    Supports reading inbox status, searching subjects/senders, and generating AI inbox summaries.
    """

    @property
    def name(self) -> str:
        return "gmail"

    @property
    def description(self) -> str:
        return (
            "Interact with Gmail to inspect unread count, list latest messages, "
            "search inbox records by sender/subject/keyword, read full email bodies, "
            "and summarize emails using AI co-founder analytics."
        )

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "operation": {
                    "type": "string",
                    "enum": [
                        "get_unread_count",
                        "list_emails",
                        "read_email",
                        "search_emails",
                        "summarize_emails"
                    ],
                    "description": "The specific inbox operation to perform."
                },
                "email_id": {
                    "type": "string",
                    "description": "Specific message ID to retrieve. Required only for 'read_email' operation."
                },
                "query": {
                    "type": "string",
                    "description": "Search keyword or filter query (e.g. 'Amazon', 'from:paypal', 'subject:invoice'). Optional."
                },
                "max_results": {
                    "type": "integer",
                    "default": 5,
                    "description": "Maximum number of email records to return."
                }
            },
            "required": ["operation"],
            "additionalProperties": False
        }

    async def _get_google_service(self, user_id: str) -> Any:
        """
        Loads user GoogleCredential, decrypts keys, handles automatic token refresh,
        and returns the built Gmail API client.
        """
        if not user_id:
            raise ValueError("Gmail access requires an active user identifier.")

        db = SessionLocal()
        try:
            cred_record = db.query(GoogleCredential).filter(GoogleCredential.user_id == user_id).first()
            if not cred_record:
                raise ValueError("No connected Google/Gmail account found. Please link your Gmail in Settings first.")

            # Decrypt access and refresh tokens
            access_token = decrypt_token(cred_record.access_token)
            refresh_token = decrypt_token(cred_record.refresh_token) if cred_record.refresh_token else None

            # Reconstruct oauth2 Credentials object
            creds = Credentials(
                token=access_token,
                refresh_token=refresh_token,
                token_uri=cred_record.token_uri,
                client_id=cred_record.client_id,
                client_secret=cred_record.client_secret,
                scopes=cred_record.scopes.split(",")
            )

            # Check and execute automatic token refresh if expired
            if creds.expired or (creds.expiry and creds.expiry < datetime.utcnow()):
                logger.info(f"Access token for user {user_id} expired. Attempting automatic refresh...")
                try:
                    creds.refresh(Request())
                    # Encrypt and save refreshed access token
                    cred_record.access_token = encrypt_token(creds.token)
                    cred_record.expires_at = creds.expiry
                    db.commit()
                    logger.info("Access token successfully refreshed and stored.")
                except Exception as refresh_err:
                    logger.error(f"Failed to refresh Google OAuth token: {refresh_err}")
                    raise ValueError("Google login session has expired. Please disconnect and reconnect your Gmail account in Settings.")

            # Build Gmail API resource service client
            return googleapiclient.discovery.build("gmail", "v1", credentials=creds)

        finally:
            db.close()

    async def execute(self, **kwargs) -> Any:
        operation = kwargs.get("operation")
        user_id = kwargs.get("user_id")

        if not user_id:
            raise ValueError("Missing 'user_id' execution parameter. Connect Gmail first.")

        # Initialize Gmail service
        service = await self._get_google_service(user_id)

        try:
            if operation == "get_unread_count":
                res = service.users().labels().get(userId="me", id="UNREAD").execute()
                count = res.get("messagesUnread", 0)
                return f"You have {count} unread emails."

            elif operation == "list_emails" or operation == "search_emails":
                query = kwargs.get("query")
                max_results = kwargs.get("max_results", 5)
                emails = await self._list_emails_raw(service, query=query, max_results=max_results)
                
                if not emails:
                    return "No matching emails found in your inbox."
                
                formatted = []
                for e in emails:
                    formatted.append(
                        f"ID: {e['id']}\nFrom: {e['from']}\nSubject: {e['subject']}\nDate: {e['date']}\nSnippet: {e['snippet']}\n---"
                    )
                return "\n".join(formatted)

            elif operation == "read_email":
                email_id = kwargs.get("email_id")
                if not email_id:
                    raise ValueError("Parameter 'email_id' is required for read_email operation.")
                
                msg = service.users().messages().get(userId="me", id=email_id, format="full").execute()
                headers = msg.get("payload", {}).get("headers", [])
                
                subject = next((h["value"] for h in headers if h["name"].lower() == "subject"), "(No Subject)")
                sender = next((h["value"] for h in headers if h["name"].lower() == "from"), "Unknown")
                snippet = msg.get("snippet", "")
                
                # Try to decode message body (text/plain)
                body = ""
                payload = msg.get("payload", {})
                parts = payload.get("parts", [])
                if not parts:
                    parts = [payload]
                for part in parts:
                    if part.get("mimeType") == "text/plain":
                        data = part.get("body", {}).get("data", "")
                        if data:
                            # Standard urlsafe b64 decoding
                            try:
                                body = base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
                            except Exception:
                                pass
                            break
                            
                if not body:
                    body = snippet
                
                return {
                    "id": email_id,
                    "subject": subject,
                    "from": sender,
                    "body": body[:800]  # Cap to prevent context bloat
                }

            elif operation == "summarize_emails":
                emails = await self._list_emails_raw(service, max_results=5)
                if not emails:
                    return "No recent emails found to summarize."

                # Construct emails log snapshot context
                context = "\n".join(
                    [f"- From: {e['from']}\n  Subject: {e['subject']}\n  Snippet: {e['snippet']}" for e in emails]
                )

                # Fetch AI response using the dynamic service
                from app.services.gemini_agent import GeminiService
                ai_service = GeminiService()
                
                logger.info("Invoking AI co-founder agent to summarize inbox metadata logs...")
                summary_prompt = (
                    "Provide a concise summary analysis of the following recent emails:\n\n"
                    f"{context}\n\n"
                    "Focus on important action items or topics."
                )
                # Call generate_response directly (without session_id to avoid recursion loop)
                summary_text = await ai_service.generate_response(message=summary_prompt)
                return summary_text

            else:
                raise ValueError(f"Unknown operation: {operation}")

        except googleapiclient.errors.HttpError as http_err:
            logger.error(f"Google API Error in Gmail tool: {http_err}")
            if http_err.resp.status in (401, 403):
                return "Failed to access Gmail: Google session is invalid or permission was revoked. Please disconnect and reconnect your Gmail in Settings."
            return f"Failed to access Gmail (Google API Error): {http_err.reason or 'HTTP ' + str(http_err.resp.status)}"
        except Exception as e:
            logger.error(f"Gmail tool operation '{operation}' failed: {e}")
            return f"Failed to run Gmail tool: {str(e)}"

    async def _list_emails_raw(self, service: Any, query: Optional[str] = None, max_results: int = 5) -> List[Dict[str, Any]]:
        """
        Helper method to list email metadata dictionaries.
        """
        response = service.users().messages().list(userId="me", maxResults=max_results, q=query).execute()
        messages = response.get("messages", [])
        
        emails = []
        for msg in messages:
            try:
                detail = service.users().messages().get(
                    userId="me",
                    id=msg["id"],
                    format="metadata",
                    metadataHeaders=["From", "Subject", "Date"]
                ).execute()
                
                headers = detail.get("payload", {}).get("headers", [])
                subject = next((h["value"] for h in headers if h["name"].lower() == "subject"), "(No Subject)")
                sender = next((h["value"] for h in headers if h["name"].lower() == "from"), "Unknown")
                date = next((h["value"] for h in headers if h["name"].lower() == "date"), "")
                
                emails.append({
                    "id": msg["id"],
                    "subject": subject,
                    "from": sender,
                    "date": date,
                    "snippet": detail.get("snippet", "")
                })
            except Exception as e:
                logger.error(f"Failed to fetch details for email {msg['id']}: {e}")
                
        return emails
