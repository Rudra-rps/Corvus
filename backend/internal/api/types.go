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
