package models

import "time"

type User struct {
	ID               uint             `gorm:"primaryKey" json:"id"`
	Phone            string           `gorm:"uniqueIndex;not null" json:"phone"`
	Name             string           `json:"name"`
	Age              int              `json:"age"`
	City             string           `json:"city"`
	EmploymentType   string           `json:"employment_type"`
	MonthlyIncome    float64          `json:"monthly_income"`
	MonthlyEMI       float64          `json:"monthly_emi"`
	CreatedAt        time.Time        `json:"created_at"`
	UpdatedAt        time.Time        `json:"updated_at"`
	FinancialProfile FinancialProfile `json:"financial_profile"`
	Transactions     []Transaction    `json:"transactions"`
}

type FinancialProfile struct {
	ID                  uint      `gorm:"primaryKey" json:"id"`
	UserID              uint      `gorm:"uniqueIndex" json:"user_id"`
	MonthlyIncome       float64   `json:"monthly_income"`
	MonthlyEMI          float64   `json:"monthly_emi"`
	MonthlySpending     float64   `json:"monthly_spending"`
	AvgBalance          float64   `json:"avg_balance"`
	TrustScore          float64   `json:"trust_score"`
	RiskScore           float64   `json:"risk_score"`
	DTIRatio            float64   `json:"dti_ratio"`
	DefaultProbability  float64   `json:"default_probability"`
	RepaymentConfidence float64   `json:"repayment_confidence"`
	RiskCategory        string    `json:"risk_category"`
	IncomeStability     float64   `json:"income_stability"`
	SpendingConsistency float64   `json:"spending_consistency"`
	EMIDiscipline       float64   `json:"emi_discipline"`
	BalanceScore        float64   `json:"balance_score"`
	Summary             string    `json:"summary"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

type Transaction struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	UserID           uint      `gorm:"index" json:"user_id"`
	Amount           float64   `json:"amount"`
	Category         string    `json:"category"`
	Type             string    `json:"type"`
	Narration        string    `json:"narration"`
	Timestamp        time.Time `json:"timestamp"`
	Balance          float64   `json:"balance"`
	SalaryLike       bool      `json:"salary_like"`
	EMILike          bool      `json:"emi_like"`
	RecurringPattern bool      `json:"recurring_pattern"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type Lender struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	Name            string    `json:"name"`
	MinIncome       float64   `json:"min_income"`
	MaxDTI          float64   `json:"max_dti"`
	MinTrustScore   float64   `json:"min_trust_score"`
	InterestRateMin float64   `json:"interest_rate_min"`
	InterestRateMax float64   `json:"interest_rate_max"`
	MaxLoanAmount   float64   `json:"max_loan_amount"`
	EmploymentType  string    `json:"employment_type"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type Recommendation struct {
	ID                  uint      `gorm:"primaryKey" json:"id"`
	UserID              uint      `gorm:"index" json:"user_id"`
	LenderID            uint      `json:"lender_id"`
	Lender              Lender    `json:"lender"`
	ApprovalProbability float64   `json:"approval_probability"`
	Explanation         string    `json:"explanation"`
	InterestRateRange   string    `json:"interest_rate_range"`
	Rank                int       `json:"rank"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}
