# Product Requirements Document (PRD) - FoundrAI

## 1. Executive Summary & Vision
FoundrAI is a production-ready, open-source-friendly AI Founder Assistant. The goal is to solve the "context switching" problem for startup founders and solopreneurs. By consolidating core data feeds—**Gmail, Google Calendar, and GitHub**—under a single, intelligent conversational interface, FoundrAI answers high-level productivity questions, automates task prioritization, and helps founders stay on top of their day.

Using the **Model Context Protocol (MCP)**, FoundrAI decouples the LLM (Gemini) from the underlying data integration tools. This allows the backend to act as a secure, authenticated gateway that fetches data on-demand without storing sensitive emails or code on its own servers, keeping data access context-local, secure, and lightweight.

---

## 2. Core User Stories & Queries
FoundrAI is optimized to handle natural language requests that require synthesizing information across multiple platforms:

### 2.1 Daily Briefing ("What should I focus on today?")
- **User Story**: As a founder, I want to see a unified view of my urgent emails, calendar conflicts, and PR reviews so I can plan my morning without opening three separate apps.
- **Synthesized Logic**: The system calls Calendar (upcoming events), Gmail (important unread messages), and GitHub (assigned PRs/issues), and outputs a prioritized checklist.

### 2.2 Communication Audit ("Any important emails?")
- **User Story**: As a founder, I want to know if clients, investors, or critical partners have emailed me, highlighting those that need immediate replies.
- **Synthesized Logic**: Fetches recent emails, filters/ranks them using LLM categorization (e.g., matching keywords or sender lists like domains of VCs/clients), and summarizes actionable threads.

### 2.3 Code & Project Review ("Any pending GitHub PRs?")
- **User Story**: As a technical founder, I want to see which pull requests are waiting for my review or have failing builds, so I don't block my engineering team.
- **Synthesized Logic**: Queries GitHub for open PRs where the user is a reviewer, is assigned, or is the author with request changes.

### 2.4 Agenda Synchronization ("What meetings do I have today?")
- **User Story**: As a founder, I want a quick rundown of my calendar schedule, along with context about who I am meeting and links to relevant emails.
- **Synthesized Logic**: Fetches today's events, identifies participants, searches Gmail for recent threads with those participants, and links them together.

---

## 3. Technology Stack (Free-Tier Constraints)
To ensure accessibility for developers, startups, and beginners, FoundrAI is architected strictly using free-tier, developer-friendly technologies.

| Component | Technology | Free Tier Provision | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js (App Router, Tailwind CSS, Shadcn/UI) | **Vercel Hobby** (Free) | Static & dynamic SSR rendering, edge middleware, responsive and modern UX. |
| **Backend** | FastAPI (Python 3.11+) | **Render / Fly.io** (Free) | High-performance, asynchronous REST API. Auto-generates OpenAPI docs. |
| **Database** | PostgreSQL | **Supabase / Neon** (Free Tier) | 100% free PostgreSQL instance. Handles user accounts, OAuth configurations, and settings. |
| **Object Storage**| Cloudflare R2 / Supabase Storage | **Cloudflare R2** (10GB Free) | S3-compatible API for storing user avatars, exported reports, or attachments. No egress fees. |
| **AI Engine** | Gemini API | **Google AI Studio** (Generative AI SDK) | **Gemini 1.5 Flash**: 15 RPM / 1,500 RPD / 1M TPM (100% Free). Supports structured outputs and function calling. |
| **Integrations** | Model Context Protocol (MCP) | Open Source Servers (GitHub, Google) | Standardized JSON-RPC protocol over SSE/Stdio for tool execution. |
| **Containerization**| Docker / Docker Compose | Community Edition (Free) | Facilitates local replication of the production environment (DB, API, Frontend, MCP). |

---

## 4. Key Constraints & Architecture Directives
1. **No Data Hoarding (Privacy-First)**: FoundrAI does not store email bodies, calendar descriptions, or source code in the database. PostgreSQL only stores user sessions, OAuth metadata, and configurations. Real data is retrieved dynamically via MCP and passed as short-lived context to Gemini.
2. **Clean & Decoupled Architecture**: Standardized directories separates API routers, core business services, database access (repositories), and the MCP adapter client layer.
3. **Multi-Tenant OAuth Handling**: The FastAPI backend acts as an OAuth 2.0 client for Google (Gmail/Calendar) and GitHub. It manages access/refresh tokens in a secure database table. When a user requests data, the backend initializes the MCP server adapter with the user's active access token.
4. **Local and Cloud Parity**: Docker Compose runs PostgreSQL, the FastAPI backend, and Next.js frontend locally, mimicking production environments.

---

## 5. Security & Compliance
- **Token Encryption**: Access and refresh tokens stored in PostgreSQL must be encrypted at rest (using symmetric Fernet encryption via cryptography).
- **HTTPS & SSL**: All API routes and OAuth redirects are forced through HTTPS in production.
- **Short-Lived LLM Context**: Data sent to Gemini is session-bound. Prompt data is not used to train Gemini models under the Google AI Studio developer terms.
- **Scoped OAuth Consents**: Request minimal scopes:
  - Google: `gmail.modify` (to read/mark read), `calendar.events.readonly`
  - GitHub: `repo` or `read:user`, `read:org`

---

## 6. Success Metrics & KPIs
- **Response Latency**: Chat prompt answers (synthesizing 3 platforms) completed in under 5 seconds (excluding initial OAuth handshakes).
- **Context Relevancy**: LLM accuracy in identifying "Important Emails" vs. promotional clutter exceeding 90% in developer testing.
- **Auth Reliability**: Zero token leakage; automatic token refresh executes seamlessly without user re-authentication prompting.
