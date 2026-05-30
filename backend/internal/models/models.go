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
	ScoreStatus         string    `json:"score_status"`
	IntakeSource        string    `json:"intake_source"`
	LoanPurpose         string    `json:"loan_purpose"`
	LoanAmountNeeded    float64   `json:"loan_amount_needed"`
	Urgency             string    `json:"urgency"`
	UseCase             string    `json:"use_case"`
	AvgBalanceBand      string    `json:"avg_balance_band"`
	RentAmount          float64   `json:"rent_amount"`
	DeclaredSpending    float64   `json:"declared_spending"`
	BusinessVintage     string    `json:"business_vintage"`
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
	ID               uint      `gorm:"primaryKey" json:"id"`
	Name             string    `json:"name"`
	LenderType       string    `json:"lender_type"` // NBFC, Bank, Fintech
	Description      string    `json:"description"`
	Website          string    `json:"website"`
	MinIncome        float64   `json:"min_income"`
	MaxDTI           float64   `json:"max_dti"`
	MinTrustScore    float64   `json:"min_trust_score"`
	InterestRateMin  float64   `json:"interest_rate_min"`
	InterestRateMax  float64   `json:"interest_rate_max"`
	MinLoanAmount    float64   `json:"min_loan_amount"`
	MaxLoanAmount    float64   `json:"max_loan_amount"`
	MinTenureMonths  int       `json:"min_tenure_months"`
	MaxTenureMonths  int       `json:"max_tenure_months"`
	MinAge           int       `json:"min_age"`
	MaxAge           int       `json:"max_age"`
	MinCIBILScore    int       `json:"min_cibil_score"`    // 0 = no bureau required
	ProcessingFeeMin float64   `json:"processing_fee_min"` // percentage
	ProcessingFeeMax float64   `json:"processing_fee_max"`
	DisbursalSpeed   string    `json:"disbursal_speed"` // e.g. "Same Day", "2-3 Days"
	GeographyTier    string    `json:"geography_tier"`  // "All", "Metro", "Tier1", "Tier1+Tier2"
	EmploymentType   string    `json:"employment_type"` // "Any", "Salaried", "Self-Employed"
	ThinFileOk       bool      `json:"thin_file_ok"`    // accepts users with no/low CIBIL
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
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
	ScoreStatus         string    `json:"score_status"`
	IntakeSource        string    `json:"intake_source"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}
