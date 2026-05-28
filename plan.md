# Corvus AI Plan

## 1. Objective

Build and launch a focused V1 of Corvus AI as an India-first `loan match + approval probability` platform for underserved borrowers.

The V1 goal is not to become a full lending infrastructure company.

The V1 goal is to prove this core hypothesis:

`Users want to know which lender is most likely to approve them before they apply.`

## 2. Product Positioning

Corvus AI should be positioned as:

`A loan discovery and recommendation platform that helps borrowers estimate eligibility, compare lenders, and avoid blind applications.`

Do not position it as:

- a bank
- a lender
- a guaranteed approval engine
- a direct disbursal platform

## 3. V1 Scope

### In Scope

- Personal loans only
- India-first borrower experience
- Tier-2 / Tier-3 salaried and light self-employed users
- Rule-based underwriting and explainability
- Lender recommendations ranked by fit
- Approval probability estimates
- Basic no-CIBIL / thin-file fallback flow

### Out of Scope

- Home loans
- Agri loans
- MSME loan complexity beyond lightweight future prep
- Full Account Aggregator integration for launch
- Direct bank integrations on day one
- Own lending book
- Loan disbursal infrastructure
- Heavy ML training pipelines
- Full multilingual voice-led onboarding

## 4. Core User Promise

When a borrower comes to Corvus AI, they should get four things quickly:

1. Whether they are likely to qualify
2. Which lenders fit them best
3. What the real borrowing cost looks like
4. Why they were matched or not matched

## 5. Current Repo Status

The workspace already contains a working prototype:

- [README.md](C:\Users\2005r\Downloads\loan\README.md) documents the current local demo flow
- [frontend](C:\Users\2005r\Downloads\loan\frontend) contains the React/Vite UI
- [backend](C:\Users\2005r\Downloads\loan\backend) contains the Go API
- [ai-service](C:\Users\2005r\Downloads\loan\ai-service) contains the FastAPI scoring service

Current product shape appears to include:

- borrower onboarding
- quick estimate / manual snapshot / CSV verification intake
- deterministic scoring
- dashboard and explainability views
- seeded lender recommendations

This means the next phase is not "start from zero."

The next phase is:

`tighten the product around a sharper V1 narrative, better lender data, and stronger recommendation quality.`

## 6. V1 Feature Set

### Must Have

- Phone login with OTP demo or real auth later
- Borrower profile capture
- Loan requirement capture
- Eligibility estimate
- Approval probability by lender
- Lender comparison table/cards
- Explainability for score and fit
- Apply / lead capture flow

### Strongly Recommended

- "Why not eligible?" state
- "How to improve approval chances" suggestions
- Basic trust score for low/no bureau users
- Admin-editable lender rule store

### Nice to Have Later

- Bank statement upload and parsing polish
- WhatsApp updates
- Vernacular UI
- Full consent-based AA data pulls
- Real KYC integrations

## 7. Recommended V1 User Flow

1. User lands on homepage
2. User enters phone and verifies OTP
3. User completes borrower profile
4. User enters desired loan amount and repayment preferences
5. User chooses intake mode:
   - quick estimate
   - manual snapshot
   - transaction-backed upload
6. Corvus computes:
   - approval probability
   - estimated affordability
   - fit-based lender ranking
7. User sees:
   - best-fit lenders
   - rate / fee / tenure comparisons
   - why each lender is a fit
   - why some lenders are not recommended
8. User clicks apply or submits lead details
9. System records lead event for tracking

## 8. Underwriting Approach for V1

Keep V1 rules-first.

Do not overbuild ML before outcome data exists.

### Inputs

- age
- city / PIN or city tier
- employment type
- monthly income
- existing EMI
- requested amount
- requested tenure
- optional CIBIL band or exact score
- optional monthly bank inflow
- optional average balance

### Core Derived Metrics

- FOIR / DTI
- disposable income estimate
- income stability bucket
- requested amount vs income multiple
- basic trust score

### Recommendation Outputs

- approval probability
- lender fit score
- estimated interest band
- estimated monthly EMI
- explanation reasons

## 9. No-CIBIL / Thin-File Strategy

This is a major long-term moat, but for V1 it should stay practical.

### V1 Thin-File Inputs

- monthly bank inflow
- salary or business continuity
- UPI usage frequency
- average monthly balance
- cashflow consistency

### V1 Output

Generate a lightweight internal trust score.

This trust score should:

- never be presented as a bureau replacement
- be framed as an internal fit indicator
- help rank lenders more intelligently for users with low bureau visibility

## 10. Lender Data Strategy

This is one of the most important sections of the business.

### Phase 1: Manual Lender Database

Use public information and internal assumptions to build a normalized lender rules table.

Each lender record should include:

- lender name
- lender type
- supported geographies
- accepted employment types
- minimum income
- minimum bureau requirement
- age range
- amount range
- tenure range
- indicative rate range
- processing fee
- foreclosure or prepayment notes
- disbursal speed
- rejection flags

### Phase 2: Affiliate / Lead Partnerships

Once traffic exists, start onboarding:

- NBFC affiliate partners
- digital lenders
- lead marketplaces

### Phase 3: Direct Integrations

After lead quality is proven, pursue:

- direct NBFC APIs
- selective bank partnerships
- underwriting data partnerships

## 11. Data Sources to Pursue

### For Launch or Near-Launch

- public lender websites
- public product pages
- internal curation
- user self-declared data
- uploaded bank statements

### For Later

- Account Aggregator providers such as Setu or Anumati
- KYC providers such as Decentro or Signzy
- bank statement analytics tools
- bureau access via partner route or direct contracting

## 12. Compliance Guardrails

These should be treated as non-negotiable product constraints.

- clearly state Corvus is a recommendation / discovery platform
- do not promise guaranteed approvals
- require user consent before collecting sensitive financial data
- encrypt stored financial data
- maintain audit logging for sensitive actions
- publish privacy policy and consent language
- avoid collecting more data than needed for the V1 flow

## 13. Metrics That Matter

### Product Metrics

- profile completion rate
- eligibility check completion rate
- recommendation page conversion rate
- apply clickthrough rate
- repeat visitor rate

### Marketplace Metrics

- lender match acceptance rate
- lead approval rate
- lead-to-disbursal rate
- disbursal turnaround feedback

### Underwriting Quality Metrics

- predicted approval vs actual approval accuracy
- false-positive match rate
- false-negative exclusion rate

## 14. Today's Plan

### Product

- lock the single V1 promise
- reduce scope to personal loans only
- finalize the required borrower fields
- define recommendation ranking factors

### Data

- create the initial lender rule sheet
- shortlist 10 to 20 personal loan lenders / NBFCs
- normalize product attributes into one schema

### Tech

- review current frontend screens against the tighter V1 journey
- review current backend models for lender rule support
- identify what is already reusable vs what needs refactoring

### Compliance

- draft privacy and consent copy
- add product disclaimer language for recommendation-only positioning

## 15. Next 7 Days

### Day 1

- create and finalize the product plan
- define lender schema
- list target lenders

### Day 2

- audit current app screens and flows
- map existing UI to V1 flow
- list gaps

### Day 3

- implement lender-rule model improvements in backend
- seed a higher quality lender dataset

### Day 4

- tighten scoring logic and explanations
- improve fit-ranking output

### Day 5

- simplify results page around approval probability and "why"
- add stronger lead capture / apply flow

### Day 6

- test end-to-end demo flow
- fix UX and data inconsistencies

### Day 7

- prepare launch/demo assets
- create investor/demo narrative
- define first user acquisition test

## 16. 30-Day Build Roadmap

### Week 1: Focus the Product

- freeze V1 scope
- improve lender data structure
- simplify borrower flow
- align messaging and UI around approval prediction

### Week 2: Improve Recommendation Quality

- strengthen deterministic scoring
- refine explainability
- improve lender compatibility logic
- handle thin-file users better

### Week 3: Lead Quality and Conversion

- implement application handoff flow
- add analytics events
- add admin-friendly lender updates if needed
- test multiple borrower scenarios

### Week 4: Demo and Launch Readiness

- polish UI
- tighten copy and disclaimers
- test with sample users
- prepare pitch, landing page, and waitlist flow

## 17. Technical Execution Plan

### Frontend

Priority screens:

- landing page
- login page
- borrower profile
- recommendation results
- explainability report

Frontend goals:

- keep the flow short
- make approval probability the hero output
- clearly show "why this lender"
- reduce dashboard complexity if it distracts from conversion

### Backend

Backend goals:

- normalize borrower profile inputs
- support lender-rule matching cleanly
- persist scoring runs and recommendation outputs
- track lead/application events

### AI Service

AI service goals:

- stay deterministic and explainable for now
- produce structured reasons
- support confidence labels
- support thin-file logic without pretending to be a bureau

## 18. Immediate Repo Tasks

These are the most practical next code tasks for this workspace.

1. Audit current UI pages and remove anything not helping the V1 story
2. Define lender-rule storage model in backend
3. Improve recommendation response shape for frontend rendering
4. Make explanations more user-friendly and trust-building
5. Add clear disclaimer and consent copy in the UI
6. Add basic analytics or at least backend event logging for user actions

## 19. Decision Log

### Locked Decisions

- V1 category: personal loans
- V1 positioning: loan discovery + recommendation
- V1 engine: rules-first, not ML-first
- V1 distribution: manual lender data first, integrations later

### Open Decisions

- whether V1 should focus only on salaried users first
- whether to expose exact approval percentages or safer probability bands
- whether to require bank-statement upload in the main flow or keep it optional
- whether lead submission is redirect-first or in-app form-first

## 20. Working Principle

Whenever scope expands, return to this question:

`Does this help the user understand approval chances and find the right lender faster?`

If the answer is no, it probably does not belong in V1.
