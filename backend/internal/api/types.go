package api

type loginRequest struct {
	Phone string `json:"phone"`
}

type verifyRequest struct {
	Phone string `json:"phone"`
	OTP   string `json:"otp"`
}

type profileRequest struct {
	Name           string  `json:"name"`
	Age            int     `json:"age"`
	City           string  `json:"city"`
	EmploymentType string  `json:"employment_type"`
	MonthlyIncome  float64 `json:"monthly_income"`
	MonthlyEMI     float64 `json:"monthly_emi"`
}

type intakeRequest struct {
	IntakeSource     string  `json:"intake_source"`
	LoanPurpose      string  `json:"loan_purpose"`
	LoanAmountNeeded float64 `json:"loan_amount_needed"`
	Urgency          string  `json:"urgency"`
	UseCase          string  `json:"use_case"`
	AvgBalanceBand   string  `json:"avg_balance_band"`
	RentAmount       float64 `json:"rent_amount"`
	DeclaredSpending float64 `json:"declared_spending"`
	BusinessVintage  string  `json:"business_vintage"`
}

type dashboardResponse struct {
	User struct {
		ID             uint    `json:"id"`
		Name           string  `json:"name"`
		City           string  `json:"city"`
		EmploymentType string  `json:"employment_type"`
		MonthlyIncome  float64 `json:"monthly_income"`
	} `json:"user"`
	Metrics map[string]any `json:"metrics"`
	Charts  map[string]any `json:"charts"`
	Flags   []string       `json:"flags"`
}
