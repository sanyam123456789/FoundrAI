import os
import base64
from cryptography.fernet import Fernet
from app.config import settings

def get_fernet_key() -> bytes:
    """
    Retrieves or derives a 32-byte key for Fernet token encryption.
    Prioritizes the ENCRYPTION_KEY environment variable.
    """
    key = os.getenv("ENCRYPTION_KEY")
    if key:
        try:
            # Validate if it's already a valid Fernet key
            Fernet(key.encode())
            return key.encode()
        except Exception:
            pass

    # Fallback: derive a key from GROQ_API_KEY or a static string
    fallback_secret = settings.GROQ_API_KEY or "foundrai_secret_fallback_key_length_32"
    # Pad or slice to exactly 32 bytes and base64-encode
    derived = fallback_secret.ljust(32)[:32].encode()
    return base64.urlsafe_b64encode(derived)


def encrypt_token(token: str) -> str:
    """
    Encrypts a plaintext token string.
    """
    if not token:
        return ""
    f = Fernet(get_fernet_key())
    return f.encrypt(token.encode()).decode()


def decrypt_token(encrypted_token: str) -> str:
    """
    Decrypts an encrypted token string.
    """
    if not encrypted_token:
        return ""
    f = Fernet(get_fernet_key())
    return f.decrypt(encrypted_token.encode()).decode()
