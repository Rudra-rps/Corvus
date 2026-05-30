from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from math import exp
from statistics import mean, pstdev
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel, Field


app = FastAPI(title="Corvus AI Service", version="0.1.0")

OPENAI_API_URL = "https://api.openai.com/v1/responses"
DEFAULT_OPENAI_MODEL = "gpt-4.1-mini"
XAI_API_URL = "https://api.x.ai/v1/chat/completions"
DEFAULT_XAI_MODEL = "grok-4"


class TransactionInput(BaseModel):
    id: int | None = None
    amount: float
    type: str | None = None
    narration: str = ""
    timestamp: str
    balance: float | None = None


class BorrowerProfileInput(BaseModel):
    monthly_income: float = 0
    monthly_emi: float = 0
    employment_type: str = "Unknown"
    city: str = ""
    age: int | None = None


class IntakeInput(BaseModel):
    intake_source: str = "quick_estimate"
    loan_purpose: str = ""
    loan_amount_needed: float = 0
    urgency: str = ""
    use_case: str = ""
    avg_balance_band: str = ""
    rent_amount: float = 0
    declared_spending: float = 0
    business_vintage: str = ""


class ClassifyTransactionsRequest(BaseModel):
    transactions: list[TransactionInput]


class TrustScoreRequest(BaseModel):
    transactions: list[TransactionInput]
    profile: BorrowerProfileInput


class ProvisionalScoreRequest(BaseModel):
    profile: BorrowerProfileInput
    intake: IntakeInput


class RiskAnalysisRequest(BaseModel):
    transactions: list[TransactionInput]
    profile: BorrowerProfileInput
    trust_score: float
    metrics: dict[str, Any] = Field(default_factory=dict)


class FraudAnalysisRequest(BaseModel):
    transactions: list[TransactionInput]


class ExplainabilityRequest(BaseModel):
    profile: BorrowerProfileInput
    trust_score: float
    risk_score: float
    risk_category: str
    default_probability: float
    metrics: dict[str, Any] = Field(default_factory=dict)
    recommendations: list[dict[str, Any]] = Field(default_factory=list)
    fraud_flags: list[str] = Field(default_factory=list)


def normalize_kind(txn: TransactionInput) -> str:
    txn_type = (txn.type or "").strip().lower()
    if txn_type in {"credit", "cr", "deposit", "inflow"}:
        return "credit"
    if txn_type in {"debit", "dr", "withdrawal", "outflow"}:
        return "debit"
    return "credit" if txn.amount >= 0 else "debit"


def classify_narration(narration: str, kind: str) -> str:
    text = narration.lower()
    rules = [
        ("salary", ["salary", "payroll", "wages", "sal credit"]),
        ("emi", ["emi", "loan", "autodebit", "ecs", "nach"]),
        ("utilities", ["electricity", "water", "broadband", "recharge", "mobile", "wifi", "gas"]),
        ("food", ["swiggy", "zomato", "restaurant", "cafe", "food"]),
        ("shopping", ["amazon", "flipkart", "myntra", "store", "shopping"]),
        ("fuel", ["fuel", "petrol", "diesel", "hpcl", "ioc"]),
        ("healthcare", ["hospital", "pharmacy", "medical", "clinic", "health"]),
        ("transfers", ["upi", "imps", "neft", "rtgs", "transfer"]),
    ]
    for category, tokens in rules:
        if any(token in text for token in tokens):
            return category
    return "income" if kind == "credit" else "other"


def month_key(timestamp: str) -> str:
    return timestamp[:7] if len(timestamp) >= 7 else "unknown"


def safe_ratio(numerator: float, denominator: float) -> float:
    return numerator / denominator if denominator else 0


def clamp(value: float, low: float = 0, high: float = 100) -> float:
    return max(low, min(high, value))


def compute_monthly_rollups(transactions: list[TransactionInput]) -> dict[str, dict[str, float]]:
    monthly: dict[str, dict[str, float]] = defaultdict(lambda: {"income": 0.0, "spend": 0.0, "balances": []})
    for txn in transactions:
        bucket = monthly[month_key(txn.timestamp)]
        kind = normalize_kind(txn)
        if kind == "credit":
            bucket["income"] += abs(txn.amount)
        else:
            bucket["spend"] += abs(txn.amount)
        if txn.balance is not None:
            bucket["balances"].append(txn.balance)
    return monthly


@app.get("/health")
def health() -> dict[str, str]:
    provider = configured_llm_provider()
    return {
        "status": "ok",
        "llm_enabled": "true" if provider else "false",
        "llm_provider": provider or "deterministic",
    }


@app.post("/classify-transactions")
def classify_transactions(payload: ClassifyTransactionsRequest) -> dict[str, Any]:
    classified = []
    recurring_counter: Counter[str] = Counter()
    for txn in payload.transactions:
        kind = normalize_kind(txn)
        category = classify_narration(txn.narration, kind)
        salary_like = category in {"salary", "income"} and kind == "credit"
        emi_like = category == "emi" and kind == "debit"
        merchant_key = txn.narration.strip().lower()[:24]
        if merchant_key:
            recurring_counter[merchant_key] += 1
        classified.append(
            {
                "id": txn.id,
                "type": kind,
                "category": category,
                "salary_like": salary_like,
                "emi_like": emi_like,
                "recurring_pattern": recurring_counter[merchant_key] > 1,
            }
        )
    return {"transactions": classified}


@app.post("/generate-trust-score")
def generate_trust_score(payload: TrustScoreRequest) -> dict[str, Any]:
    monthly = compute_monthly_rollups(payload.transactions)
    monthly_incomes = [row["income"] for row in monthly.values() if row["income"] > 0]
    monthly_spends = [row["spend"] for row in monthly.values()]
    all_balances = [balance for row in monthly.values() for balance in row["balances"]]

    avg_income = mean(monthly_incomes) if monthly_incomes else payload.profile.monthly_income
    avg_spend = mean(monthly_spends) if monthly_spends else 0
    avg_balance = mean(all_balances) if all_balances else 0

    income_stability = 100
    if len(monthly_incomes) > 1 and avg_income:
        income_stability = clamp(100 - (pstdev(monthly_incomes) / avg_income) * 100)
    spending_consistency = 100
    if len(monthly_spends) > 1 and avg_spend:
        spending_consistency = clamp(100 - (pstdev(monthly_spends) / avg_spend) * 100)

    emi_burden = safe_ratio(payload.profile.monthly_emi, avg_income or payload.profile.monthly_income) * 100
    emi_discipline = clamp(100 - emi_burden * 1.4)
    balance_score = clamp((avg_balance / max(avg_income, 1)) * 70)

    trust_score = round(
        income_stability * 0.40
        + emi_discipline * 0.25
        + balance_score * 0.20
        + spending_consistency * 0.15,
        2,
    )

    return {
        "trust_score": clamp(trust_score),
        "metrics": {
            "monthly_income": round(avg_income, 2),
            "monthly_spending": round(avg_spend, 2),
            "average_balance": round(avg_balance, 2),
            "emi_burden": round(emi_burden, 2),
            "income_stability": round(income_stability, 2),
            "spending_consistency": round(spending_consistency, 2),
            "emi_discipline": round(emi_discipline, 2),
            "balance_score": round(balance_score, 2),
            "income_months": len(monthly_incomes),
        },
    }


@app.post("/generate-provisional-score")
def generate_provisional_score(payload: ProvisionalScoreRequest) -> dict[str, Any]:
    income = payload.profile.monthly_income or 0
    emi = payload.profile.monthly_emi or 0
    rent = payload.intake.rent_amount or 0
    declared_spending = payload.intake.declared_spending or max(income * 0.45, 0)

    dti_ratio = safe_ratio(emi + rent, income or 1) * 100
    expense_ratio = safe_ratio(declared_spending + emi + rent, income or 1) * 100

    stability_bonus = {
        "salaried": 82,
        "self-employed professional": 70,
        "business owner": 66,
    }.get(payload.profile.employment_type.strip().lower(), 60)
    urgency_adjustment = {
        "immediate": -8,
        "this month": -4,
        "2-4 weeks": 0,
        "flexible": 3,
    }.get(payload.intake.urgency.strip().lower(), 0)
    balance_bonus = {
        "below_25k": 30,
        "25k_75k": 48,
        "75k_150k": 62,
        "150k_plus": 78,
    }.get(payload.intake.avg_balance_band, 42)
    purpose_bonus = {
        "working_capital": 4,
        "business_expansion": 3,
        "education": 2,
        "medical": 0,
        "consumer": -2,
        "debt_consolidation": -3,
    }.get(payload.intake.loan_purpose, 0)

    emi_discipline = clamp(100 - dti_ratio * 1.25)
    spending_consistency = clamp(100 - max(expense_ratio - 45, 0) * 1.1)
    income_stability = clamp(stability_bonus + urgency_adjustment)
    balance_score = clamp(balance_bonus)

    trust_score = round(
        income_stability * 0.40
        + emi_discipline * 0.25
        + balance_score * 0.20
        + spending_consistency * 0.15
        + purpose_bonus,
        2,
    )

    return {
        "trust_score": clamp(trust_score),
        "metrics": {
            "monthly_income": round(income, 2),
            "monthly_spending": round(declared_spending, 2),
            "average_balance": round(balance_score / 100 * max(income, 1), 2),
            "emi_burden": round(dti_ratio, 2),
            "income_stability": round(income_stability, 2),
            "spending_consistency": round(spending_consistency, 2),
            "emi_discipline": round(emi_discipline, 2),
            "balance_score": round(balance_score, 2),
            "score_status": "provisional",
            "intake_source": payload.intake.intake_source,
        },
    }


@app.post("/risk-analysis")
def risk_analysis(payload: RiskAnalysisRequest) -> dict[str, Any]:
    monthly_income = payload.metrics.get("monthly_income") or payload.profile.monthly_income or 1
    dti_ratio = round(safe_ratio(payload.profile.monthly_emi, monthly_income) * 100, 2)
    spending_ratio = round(safe_ratio(payload.metrics.get("monthly_spending", 0), monthly_income) * 100, 2)

    raw_risk = (
        (100 - payload.trust_score) * 0.5
        + dti_ratio * 0.8
        + max(spending_ratio - 65, 0) * 0.4
    )
    risk_score = clamp(raw_risk)
    default_probability = round(1 / (1 + exp(-(risk_score - 45) / 10)) * 100, 2)

    if risk_score < 30:
        category = "Low"
    elif risk_score < 60:
        category = "Moderate"
    else:
        category = "High"

    repayment_confidence = round(clamp(100 - risk_score), 2)
    return {
        "risk_score": round(risk_score, 2),
        "risk_category": category,
        "default_probability": default_probability,
        "repayment_confidence": repayment_confidence,
        "dti_ratio": dti_ratio,
    }


@app.post("/fraud-analysis")
def fraud_analysis(payload: FraudAnalysisRequest) -> dict[str, Any]:
    amounts = [abs(txn.amount) for txn in payload.transactions]
    flags: list[str] = []
    if not amounts:
        return {"flags": flags}

    avg_amount = mean(amounts)
    for txn in payload.transactions:
        if abs(txn.amount) > avg_amount * 3:
            flags.append(f"Large unusual transaction detected near {txn.timestamp}.")
            break

    transfer_spike = sum(1 for txn in payload.transactions if "upi" in txn.narration.lower() and abs(txn.amount) > avg_amount * 1.5)
    if transfer_spike >= 3:
        flags.append("High-value UPI transfer cluster detected.")

    negative_balances = [txn for txn in payload.transactions if (txn.balance or 0) < 0]
    if negative_balances:
        flags.append("Balance dipped below zero during the observation window.")

    return {"flags": flags}


def deterministic_explanations(payload: ExplainabilityRequest) -> dict[str, Any]:
    metrics = payload.metrics
    positives = []
    negatives = []

    if metrics.get("income_stability", 0) >= 75:
        positives.append("Income remained relatively stable across observed months.")
    else:
        negatives.append("Income volatility lowered score confidence.")

    if metrics.get("emi_burden", 0) <= 35:
        positives.append("Existing EMI burden is within a manageable range.")
    else:
        negatives.append("High EMI burden increased repayment risk.")

    if metrics.get("average_balance", 0) >= metrics.get("monthly_income", 0) * 0.25:
        positives.append("Average account balance shows useful cash buffer behavior.")
    else:
        negatives.append("Average balance indicates a thin buffer against shocks.")

    if payload.fraud_flags:
        negatives.extend(payload.fraud_flags)

    summary = (
        f"Corvus assigned a trust score of {payload.trust_score:.0f} with a {payload.risk_category.lower()} "
        f"risk profile. Default probability is estimated at {payload.default_probability:.1f}%."
    )
    recommendation_notes = [
        f"{item['name']} ranked strongly because trust score and DTI fit its lending policy."
        for item in payload.recommendations[:3]
    ]

    return {
        "summary": summary,
        "positives": positives,
        "negatives": negatives,
        "improvements": [
            "Reduce EMI burden or avoid taking new debt in the next quarter.",
            "Maintain steadier month-on-month balances to improve confidence.",
            "Preserve regular income inflows to strengthen the trust score.",
        ],
        "recommendation_notes": recommendation_notes,
        "ai_generated": False,
    }


def response_text(response: dict[str, Any]) -> str:
    if isinstance(response.get("output_text"), str):
        return response["output_text"]
    chunks: list[str] = []
    for item in response.get("output", []):
        for content in item.get("content", []):
            if content.get("type") in {"output_text", "text"} and isinstance(content.get("text"), str):
                chunks.append(content["text"])
    return "".join(chunks)


def configured_llm_provider() -> str | None:
    requested = os.getenv("LLM_PROVIDER", "").strip().lower()
    if requested in {"grok", "xai"} and os.getenv("XAI_API_KEY"):
        return "grok"
    if requested == "openai" and os.getenv("OPENAI_API_KEY"):
        return "openai"
    if os.getenv("XAI_API_KEY"):
        return "grok"
    if os.getenv("OPENAI_API_KEY"):
        return "openai"
    return None


def build_explanation_prompt(payload: ExplainabilityRequest, fallback: dict[str, Any]) -> dict[str, Any]:
    prompt = {
        "borrower_profile": payload.profile.model_dump(),
        "trust_score": payload.trust_score,
        "risk_score": payload.risk_score,
        "risk_category": payload.risk_category,
        "default_probability": payload.default_probability,
        "metrics": payload.metrics,
        "top_recommendations": payload.recommendations[:5],
        "fraud_flags": payload.fraud_flags,
        "deterministic_baseline": fallback,
    }
    return prompt


def parse_generated_explanation(text: str) -> dict[str, Any] | None:
    try:
        generated = json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start < 0 or end < start:
            return None
        try:
            generated = json.loads(text[start : end + 1])
        except json.JSONDecodeError:
            return None
    for key in ("summary", "positives", "negatives", "improvements", "recommendation_notes"):
        if key not in generated:
            return None
    return generated


def call_openai_explanations(payload: ExplainabilityRequest, fallback: dict[str, Any]) -> dict[str, Any] | None:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    model = os.getenv("OPENAI_MODEL", DEFAULT_OPENAI_MODEL)
    prompt = build_explanation_prompt(payload, fallback)
    request_body = {
        "model": model,
        "input": [
            {
                "role": "developer",
                "content": (
                    "You are Corvus AI, a responsible loan discovery assistant for India. "
                    "Explain underwriting outputs in plain language. Do not claim guaranteed approval. "
                    "Do not invent lender policies beyond the provided data. Keep recommendations concise, "
                    "practical, and borrower-friendly."
                ),
            },
            {
                "role": "user",
                "content": (
                    "Create a borrower-facing explanation JSON from this scoring payload. "
                    f"Payload: {json.dumps(prompt, ensure_ascii=True)}"
                ),
            },
        ],
        "text": {
            "format": {
                "type": "json_schema",
                "name": "corvus_explanation",
                "strict": True,
                "schema": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "summary": {"type": "string"},
                        "positives": {"type": "array", "items": {"type": "string"}},
                        "negatives": {"type": "array", "items": {"type": "string"}},
                        "improvements": {"type": "array", "items": {"type": "string"}},
                        "recommendation_notes": {"type": "array", "items": {"type": "string"}},
                    },
                    "required": [
                        "summary",
                        "positives",
                        "negatives",
                        "improvements",
                        "recommendation_notes",
                    ],
                },
            }
        },
    }
    request = urllib.request.Request(
        OPENAI_API_URL,
        data=json.dumps(request_body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            parsed = json.loads(response.read().decode("utf-8"))
        generated = parse_generated_explanation(response_text(parsed))
    except (json.JSONDecodeError, OSError, TimeoutError, urllib.error.URLError, urllib.error.HTTPError):
        return None

    if not generated:
        return None
    generated["ai_generated"] = True
    generated["provider"] = "openai"
    generated["model"] = model
    return generated


def call_grok_explanations(payload: ExplainabilityRequest, fallback: dict[str, Any]) -> dict[str, Any] | None:
    api_key = os.getenv("XAI_API_KEY")
    if not api_key:
        return None

    model = os.getenv("XAI_MODEL", DEFAULT_XAI_MODEL)
    prompt = build_explanation_prompt(payload, fallback)
    schema_instruction = {
        "summary": "string",
        "positives": ["string"],
        "negatives": ["string"],
        "improvements": ["string"],
        "recommendation_notes": ["string"],
    }
    request_body = {
        "model": model,
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are Corvus AI, a responsible loan discovery assistant for India. "
                    "Return only valid JSON. Do not claim guaranteed approval. Do not invent lender "
                    "policies beyond the supplied data."
                ),
            },
            {
                "role": "user",
                "content": (
                    "Create a borrower-facing explanation using this exact JSON shape: "
                    f"{json.dumps(schema_instruction, ensure_ascii=True)}. "
                    f"Scoring payload: {json.dumps(prompt, ensure_ascii=True)}"
                ),
            },
        ],
    }
    request = urllib.request.Request(
        XAI_API_URL,
        data=json.dumps(request_body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            parsed = json.loads(response.read().decode("utf-8"))
        content = parsed["choices"][0]["message"]["content"]
        generated = parse_generated_explanation(content)
    except (KeyError, IndexError, TypeError, OSError, TimeoutError, urllib.error.URLError, urllib.error.HTTPError):
        return None

    if not generated:
        return None
    generated["ai_generated"] = True
    generated["provider"] = "grok"
    generated["model"] = model
    return generated


def generate_llm_explanations(payload: ExplainabilityRequest, fallback: dict[str, Any]) -> dict[str, Any] | None:
    provider = configured_llm_provider()
    if provider == "grok":
        return call_grok_explanations(payload, fallback)
    if provider == "openai":
        return call_openai_explanations(payload, fallback)
    return None


@app.post("/generate-explanations")
def generate_explanations(payload: ExplainabilityRequest) -> dict[str, Any]:
    fallback = deterministic_explanations(payload)
    return generate_llm_explanations(payload, fallback) or fallback
