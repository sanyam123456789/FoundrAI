# REST API Endpoint Specifications - FoundrAI

The FoundrAI backend exposes REST endpoints under the base prefix `/api/v1`. Authentication is enforced across all endpoints (except registration, login, and OAuth callbacks) using a JWT bearer token passed in `Authorization` headers or via secure cookies.

---

## 1. Authentication Endpoints

### 1.1 User Registration
- **URL**: `/api/v1/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "founder@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Responses**:
  - `201 Created`: User successfully registered.
  - `400 Bad Request`: Email already registered or invalid password complexity.

### 1.2 User Login
- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "founder@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Responses**:
  - `200 OK`: Returns JWT access token. (Optionally sets an `HttpOnly` session cookie).
    ```json
    {
      "access_token": "eyJhbGciOi...",
      "token_type": "bearer"
    }
    ```
  - `401 Unauthorized`: Invalid credentials.

### 1.3 Get Current User Profile
- **URL**: `/api/v1/auth/me`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Responses**:
  - `200 OK`:
    ```json
    {
      "id": "8fa28df3-bf19-4674-a6c3-1811e5a5cc9d",
      "email": "founder@example.com",
      "is_active": true,
      "created_at": "2026-07-15T00:00:00Z"
    }
    ```
  - `401 Unauthorized`: Invalid token.

---

## 2. Integration & OAuth Endpoints

### 2.1 Initiate OAuth Flow
- **URL**: `/api/v1/integrations/oauth/{provider}`
- **Method**: `GET`
- **Params**: `provider` (Path, required, `google` or `github`)
- **Responses**:
  - `200 OK`: Returns redirection URL to Google/GitHub consent pages.
    ```json
    {
      "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
    }
    ```

### 2.2 OAuth Redirect Callback
- **URL**: `/api/v1/integrations/oauth/{provider}/callback`
- **Method**: `GET`
- **Params**:
  - `provider` (Path, required)
  - `code` (Query parameter returned by provider redirect)
  - `state` (Query parameter to prevent CSRF)
- **Description**: Exchanged authorization `code` for access/refresh tokens, encrypts the tokens, saves them to the `credentials` table, and redirects the user back to the frontend integration settings dashboard.
- **Responses**:
  - `307 Temporary Redirect` (redirects user to frontend: `http://localhost:3000/integrations?status=success`).
  - `400 Bad Request` or `401 Unauthorized` on token exchange failure.

### 2.3 Integration Connectivity Status
- **URL**: `/api/v1/integrations/status`
- **Method**: `GET`
- **Responses**:
  - `200 OK`:
    ```json
    [
      {
        "provider": "google",
        "connected": true,
        "scopes": ["gmail.modify", "calendar.events.readonly"],
        "updated_at": "2026-07-15T03:00:00Z"
      },
      {
        "provider": "github",
        "connected": false,
        "scopes": [],
        "updated_at": null
      }
    ]
    ```

### 2.4 Revoke Integration
- **URL**: `/api/v1/integrations/{provider}`
- **Method**: `DELETE`
- **Responses**:
  - `204 No Content`: Credentials successfully purged from the database.

---

## 3. Chat & AI Assistant Endpoints

### 3.1 List Chat Sessions
- **URL**: `/api/v1/chats`
- **Method**: `GET`
- **Responses**:
  - `200 OK`:
    ```json
    [
      {
        "id": "1a2b3c4d-...",
        "title": "Daily Briefing July 15",
        "created_at": "2026-07-15T02:30:00Z"
      }
    ]
    ```

### 3.2 Create Chat Session
- **URL**: `/api/v1/chats`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "title": "New Conversation"
  }
  ```
- **Responses**:
  - `201 Created`: Returns the newly instantiated session object.

### 3.3 Fetch Chat Message History
- **URL**: `/api/v1/chats/{session_id}/messages`
- **Method**: `GET`
- **Responses**:
  - `200 OK`:
    ```json
    [
      {
        "id": "...",
        "role": "user",
        "content": "What meetings do I have today?",
        "created_at": "2026-07-15T02:31:00Z"
      },
      {
        "id": "...",
        "role": "assistant",
        "content": "You have two meetings today: \n1. Team Sync at 10 AM...",
        "created_at": "2026-07-15T02:31:05Z"
      }
    ]
    ```

### 3.4 Stream AI Response (Gemini + MCP Routing)
- **URL**: `/api/v1/chats/{session_id}/stream`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "message": "Any important unread emails from VC investors?"
  }
  ```
- **Description**: Streams responses via Server-Sent Events (SSE). While generating, the API yields micro-updates about tool execution states:
  - Event `tool_start`: `{"mcp_server": "gmail", "tool": "search_emails"}`
  - Event `tool_end`: `{"mcp_server": "gmail", "status": "success"}`
  - Event `text_delta`: `{"chunk": "I found an urgent email from..."}`
- **Responses**:
  - `200 OK` (Stream: `text/event-stream`).

---

## 4. User Task Endpoints

### 4.1 Get Tasks
- **URL**: `/api/v1/tasks`
- **Method**: `GET`
- **Params**: `status` (Query, optional, `pending` or `completed`)
- **Responses**:
  - `200 OK`: List of user tasks.

### 4.2 Create Task
- **URL**: `/api/v1/tasks`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "title": "Review GitHub PR #42",
    "description": "Failing CI build check requested by lead engineer.",
    "priority": "high",
    "source_app": "github",
    "source_link": "https://github.com/org/repo/pull/42"
  }
  ```
- **Responses**:
  - `201 Created`.

### 4.3 Update Task
- **URL**: `/api/v1/tasks/{task_id}`
- **Method**: `PATCH`
- **Request Body**:
  ```json
  {
    "status": "completed",
    "priority": "medium"
  }
  ```
- **Responses**:
  - `200 OK`.

---

## 5. File Export Endpoints (S3 Integration)

### 5.1 Export Chat Session to S3
- **URL**: `/api/v1/chats/{session_id}/export`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "format": "pdf" // 'pdf' or 'markdown'
  }
  ```
- **Description**: Compiles the conversation history/briefing output, generates a file, uploads it to S3, and creates a pre-signed temporary download URL.
- **Responses**:
  - `200 OK`:
    ```json
    {
      "download_url": "https://foundrai-bucket.s3.amazonaws.com/exports/session_123.pdf?AWSAccessKeyId=...",
      "expires_at": "2026-07-15T03:30:00Z"
    }
    ```
