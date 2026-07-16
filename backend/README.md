# FoundrAI Backend - FastAPI Application Foundation (Phase 2)

This backend represents the clean, production-ready foundation for FoundrAI, initialized using FastAPI, SQLAlchemy 2.0, PostgreSQL, Alembic, and Docker.

---

## Project Structure

```
backend/
├── app/
│   ├── api/             # API routing setup (mount future routers here)
│   ├── config/          # Environment configuration validation (Pydantic Settings)
│   │   ├── __init__.py
│   │   └── settings.py
│   ├── core/            # Global Middlewares, Exceptions, and Logger config
│   │   ├── __init__.py
│   │   ├── exceptions.py
│   │   ├── logging.py
│   │   └── middlewares.py
│   ├── database/        # SQLAlchemy Engine, Session, and declarative Base
│   │   ├── __init__.py
│   │   └── session.py
│   ├── models/          # Declarative SQL models directory (empty metadata for Phase 2)
│   │   └── __init__.py
│   ├── schemas/         # Data validation DTOs and standard Response Schemas
│   │   ├── __init__.py
│   │   └── responses.py
│   ├── services/        # Service layer placeholders
│   ├── utils/           # Shared helper functions
│   └── main.py          # Application entrypoint
├── migrations/          # Alembic database migration scripts
├── alembic.ini          # Alembic CLI configuration file
├── Dockerfile           # Backend container definition (Python 3.12-slim)
├── docker-compose.yml   # Docker Compose services setup (Postgres + Backend)
├── requirements.txt     # Python dependencies manifest
├── .env.example         # Template environment configuration file
└── README.md            # Startup and operational instructions
```

---

## Configuration

The application uses **Pydantic Settings** to validate and load configurations.

1. Locate `backend/.env.example`.
2. Copy it to create your local environment file:
   ```bash
   cp .env.example .env
   ```
3. Configure the parameters inside `.env`.
   - To run locally, set `POSTGRES_HOST=localhost`.
   - To run inside Docker Compose, set `POSTGRES_HOST=postgres`.

---

## Local Startup (No Docker)

### 1. Prerequisites
Ensure you have **Python 3.12** and **PostgreSQL** running locally.

### 2. Environment Setup
Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install the dependencies:
```bash
pip install -r requirements.txt
```

### 3. Run the application
Run the FastAPI development server:
```bash
uvicorn app.main:app --reload
```
The server will start at `http://localhost:8000`. You can access:
- **API Root**: `http://localhost:8000/`
- **Health Check**: `http://localhost:8000/health`
- **Swagger Documentation**: `http://localhost:8000/docs`

---

## Running with Docker (Recommended)

You can run the backend and its PostgreSQL database with a single command.

### 1. Start Services
Make sure Docker and Docker Compose are installed and running on your machine. From the `backend/` directory, run:
```bash
docker compose up --build -d
```

This command will:
1. Build the FastAPI backend image using Python 3.12.
2. Spin up a PostgreSQL database container.
3. Link the containers together.
4. Hot-reload code changes using volume mounting.

### 2. Check Logs
To watch live application logs:
```bash
docker compose logs -f backend
```

### 3. Stop Services
To shut down containers and networks:
```bash
docker compose down
```

---

## Error Handling

Standard HTTP and validation errors are intercepted globally by exception handlers in `app/core/exceptions.py`. The standard JSON error structure is:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly description",
    "details": []
  }
}
```

---

## Logging Format

A custom access logging middleware (`app/core/middlewares.py`) automatically intercepts and prints each incoming request and outgoing response:
- **Request**: `--> Request: GET /health | Client: 127.0.0.1`
- **Response**: `<-- Response: GET /health | Status: 200 | Duration: 5.43ms`
- **Exceptions**: Stack traces are caught and printed cleanly, return standard 500 JSON.
