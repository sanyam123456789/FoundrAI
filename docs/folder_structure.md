# Monorepo Folder Structure & Clean Architecture

FoundrAI is structured as a monorepo containing the Next.js frontend, the FastAPI backend, Docker configurations, and product/architecture documentation. This layout ensures separation of concerns, scalability, and ease of deployment.

```
FoundrAI/
├── .github/                  # CI/CD Workflows (GitHub Actions)
├── backend/                  # FastAPI Backend Application
├── frontend/                 # Next.js Frontend Application
├── docker/                   # Docker deployment configurations
│   ├── dev.docker-compose.yml
│   └── prod.docker-compose.yml
├── docs/                     # Architecture & Design Documents
│   ├── prd.md
│   ├── folder_structure.md
│   ├── features_list.md
│   ├── database_schema.md
│   ├── api_endpoints.md
│   └── dev_phases_milestones.md
├── .gitignore
├── README.md
└── docker-compose.yml        # Orchestrates Local Dev Stack (Postgres, API, UI)
```

---

## 1. Backend: Clean Architecture Layout
The FastAPI backend follows a **Clean/Layered Architecture** approach. Dependency flows inward: `API Controllers (Routers) -> Business Services -> Repositories -> Database/External SDKs (MCP Client)`.

```
backend/
├── app/
│   ├── api/                  # Routing Layer (HTTP endpoints, request/response validation)
│   │   ├── deps.py           # Dependency injection (e.g., get_db, get_current_user)
│   │   └── v1/
│   │       ├── auth.py       # User auth & JWT management
│   │       ├── chat.py       # AI chat stream, history, and system prompts
│   │       ├── integrations.py # OAuth redirect & callbacks (Gmail, Calendar, GitHub)
│   │       └── users.py      # Profile management & settings
│   │
│   ├── core/                 # App configurations and constants
│   │   ├── config.py         # Pydantic Settings (env validation)
│   │   ├── security.py       # JWT tokens, password hashing, and credentials encryption
│   │   └── database.py       # DB connection pool & session factory (SQLAlchemy)
│   │
│   ├── models/               # Domain Models & Schemas
│   │   ├── domain/           # Database Models (SQLAlchemy ORM)
│   │   │   ├── user.py
│   │   │   ├── credential.py # OAuth access/refresh tokens (encrypted)
│   │   │   ├── chat.py       # Session histories
│   │   │   └── task.py       # Actionable tasks
│   │   └── schemas/          # Pydantic DTO validation structures
│   │       ├── auth.py
│   │       ├── chat.py
│   │       └── user.py
│   │
│   ├── repositories/         # Data Access Layer (Decouples DB queries from business logic)
│   │   ├── base.py           # Abstract Base Repository
│   │   ├── user_repo.py
│   │   ├── credential_repo.py
│   │   └── chat_repo.py
│   │
│   ├── services/             # Core Business Logic Layer
│   │   ├── mcp_client.py     # MCP client orchestration (manages connections & schemas)
│   │   ├── gemini_agent.py   # Synthesizer coordinating Gemini API + MCP tool calls
│   │   └── encryption.py     # AES-256 Fernet wrapper for token encryption
│   │
│   └── main.py               # Application entrypoint & middleware configuration
│
├── tests/                    # Backend unit & integration tests
│   ├── conftest.py
│   ├── api/
│   └── services/
│
├── Dockerfile.backend
├── requirements.txt          # Python dependencies
└── .env.example
```

### Key Backend Components:
- **`app/services/mcp_client.py`**: A client that connects to external MCP Servers (Gmail, Calendar, GitHub). It handles connection lifecycle, reads JSON-RPC schemas, formats tools for Gemini, and routes tool-call requests.
- **`app/services/gemini_agent.py`**: Interacts with the Gemini API using tool calling. When a founder asks a query, this service sends the query + MCP tool definitions to Gemini, captures function execution requests, forwards them to `mcp_client.py`, and returns results back to Gemini for final response synthesis.
- **`app/repositories/`**: Restricts SQL operations to this layer. This makes changing databases or writing mock tests straightforward.

---

## 2. Frontend: Next.js App Router Structure
The Next.js frontend uses standard CSS styling, Tailwind CSS, TypeScript, and the Radix-based UI library (Shadcn/UI).

```
frontend/
├── app/                      # Next.js App Router Pages and Layouts
│   ├── globals.css           # Vanilla CSS & Tailwind base setups
│   ├── layout.tsx            # Global layout wrapper (Providers, Alerts)
│   ├── page.tsx              # Landing/Marketing page
│   ├── (auth)/               # Authentication Route Group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   └── (dashboard)/          # Authenticated App Route Group
│       ├── layout.tsx        # Dashboard layout with sidebar navigation
│       ├── chat/
│       │   └── page.tsx      # Main AI Founder Assistant Chat UI
│       ├── integrations/
│       │   └── page.tsx      # Connecting Gmail, Calendar, GitHub
│       └── settings/
│           └── page.tsx      # User profile, theme settings, API configurations
│
├── components/               # Reusable UI Components
│   ├── ui/                   # Shared atomic UI elements (Button, Input, Card)
│   ├── chat/                 # Chat specific elements (MessageList, ChatInput)
│   ├── integrations/         # Integration state cards (OAuth button statuses)
│   └── layout/               # Navbars, Sidebars, and UserMenus
│
├── hooks/                    # Custom React hooks (useAuth, useChatStream)
│
├── lib/                      # Common utilities
│   ├── api_client.py         # Axios/Fetch API wrapper to request backend
│   └── utils.ts              # Styling helper (cn class merges)
│
├── public/                   # Static assets (logos, illustrations)
├── tests/                    # Playwright or Jest integration tests
├── Dockerfile.frontend
├── package.json
└── tsconfig.json
```

### Key Frontend Components:
- **`app/(dashboard)/chat/`**: Features a premium interface resembling ChatGPT/Claude, supporting markdown tables, source-code blocks, dynamic loader steps (showing which MCP tools the agent is invoking), and interactive checklists.
- **`app/(dashboard)/integrations/`**: Central dashboard for founders to connect their Google and GitHub accounts. Handles authentication flow statuses, displays warning banners for expired tokens, and explains requested scopes.
