# Development Phases & Milestones - FoundrAI

To construct a production-ready system while managing development complexities, we break down the creation of FoundrAI into six distinct phases. Each phase culminates in a clear, verifiable milestone.

---

## Development Phases

### Phase 1: Project Setup & Authentication Foundation (Week 1)
- **Monorepo Setup**: Establish the directory structures for `frontend/` and `backend/`. Set up core configs (`package.json`, `requirements.txt`, TypeScript configurations).
- **Backend Setup**: Scaffold FastAPI with Pydantic settings. Integrate SQLAlchemy/SQLModel database configurations connected to a local Dockerized PostgreSQL instance. Setup Alembic for database migrations.
- **Authentication**: Build user registration and JWT-based authentication endpoints.
- **Frontend Setup**: Initialize Next.js App Router. Install Tailwind CSS and Shadcn UI components. Build registration and login pages connecting to the backend auth API.

### Phase 2: Secure Multi-Tenant Integrations Hub (Week 2)
- **Google OAuth**: Configure Google Developer Console. Build backend endpoints for the Google OAuth 2.0 authentication loop (`/integrations/oauth/google` and its callback).
- **GitHub OAuth**: Configure GitHub OAuth App credentials. Implement GitHub callback endpoint.
- **Credential Security**: Implement AES-256 token encryption (Fernet) inside the repository layer so credentials are encrypted before hitting the database.
- **Automatic Token Refresher**: Write logic checking token expirations and executing background POST queries to refresh expired Google OAuth credentials.
- **Dashboard Interface**: Build frontend connection cards reflecting linked services (`Connected`, `Expired`, `Disconnected`).

### Phase 3: Model Context Protocol (MCP) Client Adapter (Week 3)
- **MCP Client Architecture**: Implement standard JSON-RPC protocol over SSE or Stdio clients inside FastAPI.
- **Local MCP Testing**: Set up community MCP servers (GitHub, Gmail, Google Calendar) to run locally using Docker or node processes.
- **Dynamic Tool Registry**: Write parser code that fetches tools from active MCP servers, filters them based on what integrations the user has connected, and outputs them as JSON schemas.

### Phase 4: Gemini Agent & Tool Execution Loop (Week 4)
- **Gemini Integration**: Integrate Google's Generative AI SDK using the free-tier Gemini 1.5 Flash.
- **Tool Mapping**: Map MCP tool schemas to Gemini's expected Function Declarations.
- **Tool calling Coordinator**: Build the execution loop:
  1. User asks question.
  2. Send message + function schemas to Gemini.
  3. Capture Gemini's tool call requests.
  4. Query the local MCP client matching the function parameters using the active user's decrypted access token.
  5. Send the result back to Gemini.
  6. Repeat if Gemini requests further tool calls.
  7. Stream the final response to the user.
- **SSE Streaming**: Expose the chat endpoint as a Server-Sent Events (SSE) stream, delivering both chat chunks and step-by-step logs of executed tools.

### Phase 5: Rich Dashboard & Chat UI (Week 5)
- **Premium Chat UI**: Build the main chat dashboard using Shadcn UI. Implement chat bubble rendering supporting markdown headers, tables, and code snippets.
- **Activity Log Tracker**: Render a collapsible step-by-step loader showing what tools the AI is currently executing in real-time based on the SSE stream.
- **Tasks Checklist**: Build a sidebar checklist page displaying tasks from the database. Implement endpoint operations to mark items completed or change priorities.

### Phase 6: Export Engine, Dockerization & Production Readying (Week 6)
- **AWS S3 / Cloudflare R2 Export**: Integrate boto3 to upload generated markdown reports to S3. Implement temporary pre-signed URL generation.
- **Docker Compose**: Create a production `docker-compose.yml` orchestrating:
  - Next.js (built in standalone production mode).
  - FastAPI (served via Uvicorn).
  - PostgreSQL DB.
  - LocalStack (for local S3 mocking) or production R2 variables.
- **Production Polish**: Add system health check endpoints. Implement rate limiting on API endpoints (e.g., using slowapi). Configure secure CORS headers.

---

## Milestones

| Milestone | Deliverable | Verification Criteria | Target Date |
| :--- | :--- | :--- | :--- |
| **M1: Core Auth** | User authentication API & frontend pages. | Users can register, log in, view their secure dashboards, and sessions persist on reload. | End of Week 1 |
| **M2: Integrations**| Encrypted Google/GitHub OAuth links. | OAuth callback finishes, credentials table populates with encrypted keys, and integrations dashboard shows live connections. | End of Week 2 |
| **M3: MCP Bridge** | Client connecting to Gmail/Calendar/GitHub MCP. | FastAPI can send queries to local Gmail/Calendar/GitHub MCP servers and receive JSON payloads. | End of Week 3 |
| **M4: Gemini Loop**| SSE Chat API with tool execution logs. | Querying `/api/v1/chats/{id}/stream` yields text tokens and intermediate tool call logs synchronously. | End of Week 4 |
| **M5: Interface** | Front-end Chat UI with Activity Logs & Task list. | User can chat with Gemini, see live visual indicators of data lookups, and interact with the task priorities checklist. | End of Week 5 |
| **M6: Prod Ready** | Docker container system & S3 exports. | Running `docker compose up --build` compiles the app. Export buttons successfully upload to S3/R2 and return working links. | End of Week 6 |
