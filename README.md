# Corvus AI

Corvus AI is a hackathon-ready alternative credit intelligence platform for underserved India. This workspace now includes:

- `frontend`: Vite/React UI
- `backend`: Go + Fiber API with SQLite fallback and lender seeding
- `ai-service`: FastAPI deterministic scoring and explainability service

## Local Run

### 1. Start the AI service

```powershell
cd C:\Users\2005r\Downloads\loan\ai-service
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### 2. Start the backend

```powershell
cd C:\Users\2005r\Downloads\loan\backend
go run .
```

Optional environment variables:

- `PORT` default: `8080`
- `AI_SERVICE_URL` default: `http://localhost:8000`
- `DATABASE_URL` default: `sqlite://corvus.db`

### 3. Start the frontend

```powershell
cd C:\Users\2005r\Downloads\loan\frontend
npm install
npm run dev
```

Optional frontend environment variable:

- `VITE_API_URL` default: `http://localhost:8080`

## Demo Flow

1. Open the frontend and go to `Launch Terminal`
2. Enter any phone number
3. Use OTP `123456`
4. Complete borrower onboarding
5. Upload [sample-statement.csv](/C:/Users/2005r/Downloads/loan/sample-statement.csv)
6. Wait for analysis to complete
7. Review dashboard, lender recommendations, and explainability screens

## API Summary

- `POST /auth/login`
- `POST /auth/verify`
- `POST /profile/:userID`
- `GET /profile/:userID`
- `POST /upload`
- `POST /analyze/:userID`
- `GET /dashboard/:userID`
- `GET /recommendations/:userID`
- `GET /explanations/:userID`

## Notes

- The backend uses a pure-Go SQLite driver locally to avoid Windows CGO issues.
- Recommendation ranking is deterministic and uses seeded mock lenders.
- The AI service is intentionally rules-first for hackathon reliability and explainability.
