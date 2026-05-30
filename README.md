# Corvus AI

Corvus AI is a hackathon-ready alternative credit intelligence platform for underserved Indian borrowers. The product is focused on one clear V1 promise:

`Find the lenders most likely to approve you before you apply.`

This workspace includes:

- `frontend`: Vite/React UI
- `backend`: Go + Fiber API with SQLite, auto-migration, and lender seeding
- `ai-service`: FastAPI deterministic scoring and explainability service

## Implementation Status

### Frontend

The React app includes eight main screens:

- Landing page
- Phone + OTP login
- Borrower profile onboarding
- Financial data center with quick estimate, manual snapshot, and CSV upload
- AI intelligence loading screen
- Underwriting cockpit
- Lender recommendations
- AI explainability report

The layout includes desktop side navigation, mobile header, mobile bottom navigation, and the persistent agent strip.

### Backend

The Go API handles authentication, profile capture, intake capture, CSV upload, analysis, dashboard data, lender recommendations, and explainability.

SQLite is used locally with automatic migrations on startup. The lender catalogue is reseeded on startup so reused demo databases get the latest lender metadata.

### AI Service

The FastAPI service is deterministic and uses no external AI provider keys. It supports transaction classification, verified trust scoring, provisional trust scoring, risk analysis, fraud flags, and explanations.

Optional LLM enhancement is available for borrower-facing explanations. If `XAI_API_KEY` or `OPENAI_API_KEY` is present, `/generate-explanations` uses an LLM to rewrite summaries, positives, negatives, improvement steps, and recommendation notes in structured JSON. If no key is present or the API call fails, Corvus automatically falls back to deterministic explanations.

Optional AI environment variables:

- `LLM_PROVIDER`: optional provider override, use `grok` or `openai`
- `XAI_API_KEY`: server-side xAI API key for Grok
- `XAI_MODEL`: optional Grok model override, default `grok-4`
- `OPENAI_API_KEY`: server-side OpenAI API key
- `OPENAI_MODEL`: optional model override, default `gpt-4.1-mini`

### Lender Catalogue

The current seed data includes 15 Indian lenders and NBFCs, including KreditBee, MoneyView, Navi, Fibe, CASHe, Stashfin, LoanTap, InCred Finance, Poonawalla Fincorp, PaySense, Prefr, IDFC FIRST Bank, Bajaj Finserv, SmartCoin, and Zype.

Each lender includes eligibility and recommendation fields such as minimum income, DTI tolerance, trust score threshold, age range, CIBIL requirement, loan range, tenure range, processing fees, disbursal speed, geography tier, employment type, and thin-file support.

## Intake Modes

Corvus now supports three underwriting entry paths:

- `Quick Estimate`: intent-first provisional scoring
- `Manual Snapshot`: self-declared financial snapshot for provisional scoring
- `CSV Verification`: transaction-backed verified scoring

Scores and recommendations are labeled as `provisional` or `verified` depending on the evidence level.

## Local Run

### 1. Start the AI service

```powershell
cd C:\Users\2005r\Downloads\loan\ai-service
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Optional Grok-enhanced explanations:

```powershell
$env:LLM_PROVIDER="grok"
$env:XAI_API_KEY="your_xai_key_here"
$env:XAI_MODEL="grok-4"
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Optional OpenAI-enhanced explanations:

```powershell
$env:LLM_PROVIDER="openai"
$env:OPENAI_API_KEY="your_api_key_here"
$env:OPENAI_MODEL="gpt-4.1-mini"
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
5. Choose one intake path:
   - run a quick estimate
   - complete a manual snapshot
   - or upload `sample-statement.csv`
6. Wait for analysis to complete
7. Review dashboard, lender recommendations, and explainability screens

## API Summary

- `GET /health`
- `POST /auth/login`
- `POST /auth/verify`
- `POST /profile/:userID`
- `GET /profile/:userID`
- `POST /intake/:userID`
- `POST /upload`
- `POST /analyze/:userID`
- `GET /dashboard/:userID`
- `GET /recommendations/:userID`
- `GET /explanations/:userID`

## Final Validation

Last validated locally:

- `go test ./...` from `backend`
- `python -m py_compile main.py` from `ai-service`
- `npm run lint` from `frontend`
- `npm run build` from `frontend`
- Provisional analysis API flow
- CSV verified analysis API flow
- Browser smoke test at `http://127.0.0.1:5173/`

## Notes

- The backend uses a pure-Go SQLite driver locally to avoid Windows CGO issues.
- Recommendation ranking is deterministic and uses seeded lender rules.
- The AI service is intentionally rules-first for hackathon reliability and explainability.
- Demo OTP is `123456`.
- This is a loan discovery and recommendation demo, not a lender, bank, or guaranteed approval system.
