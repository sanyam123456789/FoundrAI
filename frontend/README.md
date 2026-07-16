# FoundrAI Frontend - Next.js App Router

This is the Next.js client-facing web application for the FoundrAI SaaS platform. It leverages Tailwind CSS for styling and custom Shadcn-modeled react modules for components rendering.

## Directory Layout Details

- **`app/`**: Contains page endpoints and layouts.
  - **`layout.tsx`**: Main html configuration wrapper. Imports CSS files and provider scopes.
  - **`page.tsx`**: Landing landing page for marketing.
  - **`(auth)/`**: Route group containing user register and login screens.
  - **`(dashboard)/`**: Protected route group configuring layouts, sidebars, settings parameters, integration buttons, and chat grids.
- **`components/`**: Atomic, modular visual panels.
  - **`ui/`**: Core items (buttons, inputs, modal containers).
  - **`chat/`**: Custom logs lists and prompt bar widgets.
  - **`integrations/`**: Status tracking panels for Gmail and GitHub.
- **`lib/`**: Helpers and service classes, including **`api_client.ts`** which manages HTTP Fetch queries, token headers, and streaming parser connections.

---

## Local Startup (No Docker)

1. Make sure Node.js v18+ is installed.
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Boot development compiler:
   ```bash
   npm run dev
   ```
4. Access client in browser at `http://localhost:3000`.
