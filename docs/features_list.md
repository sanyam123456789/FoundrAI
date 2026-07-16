# Features List - FoundrAI

FoundrAI delivers a comprehensive set of features tailored specifically to the needs of startup founders. These features are organized into six logical modules.

---

## 1. Authentication & Session Management
- **User Signup & Signin**: Standard email/password registration with JWT authentication.
- **Session Persistence**: JWT-based session checks with secure HTTP-only cookies.
- **Secure Password Hashing**: Passwords stored as salted Argon2/bcrypt hashes in PostgreSQL.
- **Multi-Tenant Isolation**: Row-level tenant partitioning ensuring users can only view their own integrations, chat history, and tokens.

---

## 2. Integrations Hub (OAuth & MCP Control Panel)
This dashboard allows users to link third-party accounts and check connectivity status.
- **Google OAuth Integration (Gmail & Calendar)**:
  - Guided OAuth flow requesting `gmail.modify` and `calendar.events.readonly` permissions.
  - Encryption layer for secure storage of refresh tokens.
  - Automatic silently handling token refreshes on expired credentials.
- **GitHub Integration**:
  - OAuth or personal access token (PAT) configuration.
  - Access scopes to private/public repositories.
- **Status Dashboard**:
  - Connection indicator badges (e.g., `Connected`, `Needs Re-authentication`, `Disconnected`).
  - Access scoping explanations to make sure users understand data usage boundaries.

---

## 3. Premium AI Chat Interface
A conversational control center displaying data integration progress.
- **Streaming Responses**: Real-time server-sent events (SSE) chat responses for instant feedback.
- **MCP Tool Invocation Logs (Activity Feed)**:
  - Collapsible, step-by-step indicators showing what the AI is executing (e.g., `"🔍 Querying Gmail for 'investor'..."`, `"📅 Checking calendar for conflict at 2 PM..."`).
- **Markdown Rendering**: Native rendering of rich components:
  - Formatted tables displaying PR lists.
  - Blockquotes summarizing client requests.
  - Synthesized checklists for action items.
- **Chat History Management**:
  - Sidebar indexing past chat sessions.
  - Deleting, renaming, and searching previous conversations.

---

## 4. Synthesized Founder Intelligence (MCP Actions)
These features power the synthetic questions by chaining actions across MCP modules:

### 4.1 Daily Briefing Generator
- Aggregates Gmail unread priorities, GitHub PR review blockers, and today's Google Calendar meetings.
- Returns a clean priorities dashboard categorized as: **High Priority Tasks**, **Upcoming Meetings**, and **Blockers / PRs**.

### 4.2 Gmail Inbox Synthesizer
- Lists the most important unread emails from the past 24 hours.
- Uses Gemini tool calls to search by labels, domains, or sentiment (e.g., prioritizing emails containing "agreement", "invoice", "schedule", "proposal", or domain structures of VCs/clients).

### 4.3 Google Calendar Coordinator
- Lists today's agenda.
- Looks up meeting invitees and runs a background query on Gmail for recent discussions containing the invitee's name to generate a "meeting context sheet".

### 4.4 GitHub Development Watchdog
- Lists open Pull Requests requiring user approval.
- Flags PRs created by the user that have failing CI/CD builds or negative reviews.

---

## 5. Storage & Export Engine (S3 Integration)
- **Daily Briefing Export**: Saves daily summaries as markdown or PDF files and uploads them to S3/Cloudflare R2.
- **Presigned URLs**: Dynamically generates secure, temporary download URLs (valid for 15 minutes) for exported reports.
- **Export History**: Logs all generated summaries for easy access and downloading.

---

## 6. Preferences & Workspace Settings
- **Theme Selection**: Seamless system-wide Toggle for Dark/Light mode.
- **LLM Configuration**: Allows users to choose between Gemini models (Gemini 1.5 Flash for speed, Gemini 1.5 Pro for deep reasoning) and adjust temperature settings.
- **Data Retention Settings**: Toggle options to wipe chat history or delete linked credentials, triggering complete database cascades.
