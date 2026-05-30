package api

import (
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"math"
	"mime/multipart"
	"sort"
	"strconv"
	"strings"
	"time"

	"corvus/backend/internal/ai"
	"corvus/backend/internal/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type Handler struct {
	db *gorm.DB
	ai *ai.Client
}

func NewHandler(db *gorm.DB, aiClient *ai.Client) *Handler {
	return &Handler{db: db, ai: aiClient}
}

func (h *Handler) Register(app *fiber.App) {
	app.Get("/health", h.health)
	app.Post("/auth/login", h.login)
	app.Post("/auth/verify", h.verifyOTP)
	app.Post("/profile/:userID", h.saveProfile)
	app.Post("/intake/:userID", h.saveIntake)
	app.Get("/profile/:userID", h.getProfile)
	app.Post("/upload", h.uploadCSV)
	app.Post("/analyze/:userID", h.analyzeUser)
	app.Get("/dashboard/:userID", h.getDashboard)
	app.Get("/recommendations/:userID", h.getRecommendations)
	app.Get("/explanations/:userID", h.getExplanations)
}

func (h *Handler) health(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "ok"})
}

func (h *Handler) login(c *fiber.Ctx) error {
	var req loginRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid login payload")
	}
	if strings.TrimSpace(req.Phone) == "" {
		return fiber.NewError(fiber.StatusBadRequest, "phone is required")
	}
	return c.JSON(fiber.Map{
		"phone":   req.Phone,
		"message": "OTP generated for demo flow",
		"otp":     "123456",
	})
}

func (h *Handler) verifyOTP(c *fiber.Ctx) error {
	var req verifyRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid verify payload")
	}
	if req.OTP != "123456" {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid otp")
	}

	var user models.User
	err := h.db.Where("phone = ?", req.Phone).First(&user).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return err
	}
	if err == gorm.ErrRecordNotFound {
		user = models.User{Phone: req.Phone}
		if err := h.db.Create(&user).Error; err != nil {
			return err
		}
		profile := models.FinancialProfile{UserID: user.ID}
		if err := h.db.Create(&profile).Error; err != nil {
			return err
		}
	}
	return c.JSON(fiber.Map{"user": user})
}

func (h *Handler) saveProfile(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("userID")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid user id")
	}
	var req profileRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid profile payload")
	}
	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "user not found")
	}
	user.Name = req.Name
	user.Age = req.Age
	user.City = req.City
	user.EmploymentType = req.EmploymentType
	user.MonthlyIncome = req.MonthlyIncome
	user.MonthlyEMI = req.MonthlyEMI
	if err := h.db.Save(&user).Error; err != nil {
		return err
	}

	var profile models.FinancialProfile
	if err := h.db.Where("user_id = ?", user.ID).First(&profile).Error; err != nil {
		return err
	}
	profile.MonthlyIncome = req.MonthlyIncome
	profile.MonthlyEMI = req.MonthlyEMI
	if err := h.db.Save(&profile).Error; err != nil {
		return err
	}

	return c.JSON(fiber.Map{"user": user})
}

func (h *Handler) getProfile(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("userID")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid user id")
	}
	var user models.User
	if err := h.db.Preload("FinancialProfile").First(&user, userID).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "user not found")
	}
	return c.JSON(fiber.Map{"user": user})
}

func (h *Handler) saveIntake(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("userID")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid user id")
	}
	var req intakeRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid intake payload")
	}
	var profile models.FinancialProfile
	if err := h.db.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		return err
	}
	profile.IntakeSource = req.IntakeSource
	profile.LoanPurpose = req.LoanPurpose
	profile.LoanAmountNeeded = req.LoanAmountNeeded
	profile.Urgency = req.Urgency
	profile.UseCase = req.UseCase
	profile.AvgBalanceBand = req.AvgBalanceBand
	profile.RentAmount = req.RentAmount
	profile.DeclaredSpending = req.DeclaredSpending
	profile.BusinessVintage = req.BusinessVintage
	if req.IntakeSource != "csv_verified" {
		profile.ScoreStatus = "provisional"
	}
	if err := h.db.Save(&profile).Error; err != nil {
		return err
	}
	return c.JSON(fiber.Map{"profile": profile})
}

func (h *Handler) uploadCSV(c *fiber.Ctx) error {
	userID, err := strconv.Atoi(c.FormValue("user_id"))
	if err != nil || userID <= 0 {
		return fiber.NewError(fiber.StatusBadRequest, "user_id is required")
	}
	fileHeader, err := c.FormFile("file")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "csv file is required")
	}
	transactions, err := parseCSV(fileHeader)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if err := h.db.Where("user_id = ?", userID).Delete(&models.Transaction{}).Error; err != nil {
		return err
	}
	for i := range transactions {
		transactions[i].UserID = uint(userID)
	}
	if err := h.db.Create(&transactions).Error; err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"message":      "transactions uploaded",
		"count":        len(transactions),
		"transactions": transactions,
	})
}

func (h *Handler) analyzeUser(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("userID")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid user id")
	}
	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "user not found")
	}
	var profile models.FinancialProfile
	if err := h.db.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		return err
	}
	var transactions []models.Transaction
	if err := h.db.Where("user_id = ?", userID).Find(&transactions).Error; err != nil {
		return err
	}
	mode := c.Query("mode")
	isProvisional := mode == "provisional" || (len(transactions) == 0 && profile.IntakeSource != "")
	if len(transactions) == 0 && !isProvisional {
		return fiber.NewError(fiber.StatusBadRequest, "no transactions uploaded for user")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 45*time.Second)
	defer cancel()

	txPayload := toAITransactions(transactions)
	profilePayload := fiber.Map{
		"monthly_income":  user.MonthlyIncome,
		"monthly_emi":     user.MonthlyEMI,
		"employment_type": user.EmploymentType,
		"city":            user.City,
		"age":             user.Age,
	}
	if isProvisional {
		return h.analyzeProvisional(c, ctx, user, profile, profilePayload)
	}

	var classifyResp struct {
		Transactions []struct {
			ID               uint   `json:"id"`
			Type             string `json:"type"`
			Category         string `json:"category"`
			SalaryLike       bool   `json:"salary_like"`
			EMILike          bool   `json:"emi_like"`
			RecurringPattern bool   `json:"recurring_pattern"`
		} `json:"transactions"`
	}
	if err := h.ai.Post(ctx, "/classify-transactions", fiber.Map{"transactions": txPayload}, &classifyResp); err != nil {
		return fiber.NewError(fiber.StatusBadGateway, err.Error())
	}
	for _, result := range classifyResp.Transactions {
		h.db.Model(&models.Transaction{}).Where("id = ?", result.ID).Updates(map[string]any{
			"type":              result.Type,
			"category":          result.Category,
			"salary_like":       result.SalaryLike,
			"emi_like":          result.EMILike,
			"recurring_pattern": result.RecurringPattern,
		})
	}

	var trustResp struct {
		TrustScore float64        `json:"trust_score"`
		Metrics    map[string]any `json:"metrics"`
	}
	if err := h.ai.Post(ctx, "/generate-trust-score", fiber.Map{
		"transactions": txPayload,
		"profile":      profilePayload,
	}, &trustResp); err != nil {
		return fiber.NewError(fiber.StatusBadGateway, err.Error())
	}

	var riskResp struct {
		RiskScore           float64 `json:"risk_score"`
		RiskCategory        string  `json:"risk_category"`
		DefaultProbability  float64 `json:"default_probability"`
		RepaymentConfidence float64 `json:"repayment_confidence"`
		DTIRatio            float64 `json:"dti_ratio"`
	}
	if err := h.ai.Post(ctx, "/risk-analysis", fiber.Map{
		"transactions": txPayload,
		"profile":      profilePayload,
		"trust_score":  trustResp.TrustScore,
		"metrics":      trustResp.Metrics,
	}, &riskResp); err != nil {
		return fiber.NewError(fiber.StatusBadGateway, err.Error())
	}

	var fraudResp struct {
		Flags []string `json:"flags"`
	}
	if err := h.ai.Post(ctx, "/fraud-analysis", fiber.Map{"transactions": txPayload}, &fraudResp); err != nil {
		return fiber.NewError(fiber.StatusBadGateway, err.Error())
	}

	recommendations, err := h.computeRecommendations(uint(userID), user, trustResp.TrustScore, riskResp.DTIRatio, "verified", "csv_verified")
	if err != nil {
		return err
	}

	var explainResp struct {
		Summary             string   `json:"summary"`
		Positives           []string `json:"positives"`
		Negatives           []string `json:"negatives"`
		Improvements        []string `json:"improvements"`
		RecommendationNotes []string `json:"recommendation_notes"`
		AIGenerated         bool     `json:"ai_generated"`
		Provider            string   `json:"provider,omitempty"`
		Model               string   `json:"model,omitempty"`
	}
	if err := h.ai.Post(ctx, "/generate-explanations", fiber.Map{
		"profile":             profilePayload,
		"trust_score":         trustResp.TrustScore,
		"risk_score":          riskResp.RiskScore,
		"risk_category":       riskResp.RiskCategory,
		"default_probability": riskResp.DefaultProbability,
		"metrics":             trustResp.Metrics,
		"recommendations":     recommendations,
		"fraud_flags":         fraudResp.Flags,
	}, &explainResp); err != nil {
		return fiber.NewError(fiber.StatusBadGateway, err.Error())
	}

	profile.MonthlyIncome = toFloat(trustResp.Metrics["monthly_income"])
	profile.MonthlyEMI = user.MonthlyEMI
	profile.MonthlySpending = toFloat(trustResp.Metrics["monthly_spending"])
	profile.AvgBalance = toFloat(trustResp.Metrics["average_balance"])
	profile.TrustScore = trustResp.TrustScore
	profile.RiskScore = riskResp.RiskScore
	profile.DTIRatio = riskResp.DTIRatio
	profile.DefaultProbability = riskResp.DefaultProbability
	profile.RepaymentConfidence = riskResp.RepaymentConfidence
	profile.RiskCategory = riskResp.RiskCategory
	profile.IncomeStability = toFloat(trustResp.Metrics["income_stability"])
	profile.SpendingConsistency = toFloat(trustResp.Metrics["spending_consistency"])
	profile.EMIDiscipline = toFloat(trustResp.Metrics["emi_discipline"])
	profile.BalanceScore = toFloat(trustResp.Metrics["balance_score"])
	profile.ScoreStatus = "verified"
	profile.IntakeSource = "csv_verified"
	profile.Summary = explainResp.Summary
	if err := h.db.Save(&profile).Error; err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"trust_score":     trustResp.TrustScore,
		"risk_score":      riskResp.RiskScore,
		"risk_category":   riskResp.RiskCategory,
		"score_status":    profile.ScoreStatus,
		"intake_source":   profile.IntakeSource,
		"recommendations": recommendations,
		"flags":           fraudResp.Flags,
		"explanations":    explainResp,
	})
}

func (h *Handler) analyzeProvisional(c *fiber.Ctx, ctx context.Context, user models.User, profile models.FinancialProfile, profilePayload fiber.Map) error {
	var trustResp struct {
		TrustScore float64        `json:"trust_score"`
		Metrics    map[string]any `json:"metrics"`
	}
	if err := h.ai.Post(ctx, "/generate-provisional-score", fiber.Map{
		"profile": profilePayload,
		"intake": fiber.Map{
			"loan_purpose":       profile.LoanPurpose,
			"loan_amount_needed": profile.LoanAmountNeeded,
			"urgency":            profile.Urgency,
			"use_case":           profile.UseCase,
			"avg_balance_band":   profile.AvgBalanceBand,
			"rent_amount":        profile.RentAmount,
			"declared_spending":  profile.DeclaredSpending,
			"business_vintage":   profile.BusinessVintage,
			"intake_source":      profile.IntakeSource,
		},
	}, &trustResp); err != nil {
		return fiber.NewError(fiber.StatusBadGateway, err.Error())
	}

	var riskResp struct {
		RiskScore           float64 `json:"risk_score"`
		RiskCategory        string  `json:"risk_category"`
		DefaultProbability  float64 `json:"default_probability"`
		RepaymentConfidence float64 `json:"repayment_confidence"`
		DTIRatio            float64 `json:"dti_ratio"`
	}
	if err := h.ai.Post(ctx, "/risk-analysis", fiber.Map{
		"transactions": []map[string]any{},
		"profile":      profilePayload,
		"trust_score":  trustResp.TrustScore,
		"metrics":      trustResp.Metrics,
	}, &riskResp); err != nil {
		return fiber.NewError(fiber.StatusBadGateway, err.Error())
	}

	recommendations, err := h.computeRecommendations(user.ID, user, trustResp.TrustScore, riskResp.DTIRatio, "provisional", profile.IntakeSource)
	if err != nil {
		return err
	}

	var explainResp struct {
		Summary             string   `json:"summary"`
		Positives           []string `json:"positives"`
		Negatives           []string `json:"negatives"`
		Improvements        []string `json:"improvements"`
		RecommendationNotes []string `json:"recommendation_notes"`
		AIGenerated         bool     `json:"ai_generated"`
		Provider            string   `json:"provider,omitempty"`
		Model               string   `json:"model,omitempty"`
	}
	if err := h.ai.Post(ctx, "/generate-explanations", fiber.Map{
		"profile":             profilePayload,
		"trust_score":         trustResp.TrustScore,
		"risk_score":          riskResp.RiskScore,
		"risk_category":       riskResp.RiskCategory,
		"default_probability": riskResp.DefaultProbability,
		"metrics":             trustResp.Metrics,
		"recommendations":     recommendations,
		"fraud_flags":         []string{},
	}, &explainResp); err != nil {
		return fiber.NewError(fiber.StatusBadGateway, err.Error())
	}

	profile.MonthlyIncome = toFloat(trustResp.Metrics["monthly_income"])
	profile.MonthlyEMI = user.MonthlyEMI
	profile.MonthlySpending = toFloat(trustResp.Metrics["monthly_spending"])
	profile.AvgBalance = toFloat(trustResp.Metrics["average_balance"])
	profile.TrustScore = trustResp.TrustScore
	profile.RiskScore = riskResp.RiskScore
	profile.DTIRatio = riskResp.DTIRatio
	profile.DefaultProbability = riskResp.DefaultProbability
	profile.RepaymentConfidence = riskResp.RepaymentConfidence
	profile.RiskCategory = riskResp.RiskCategory
	profile.IncomeStability = toFloat(trustResp.Metrics["income_stability"])
	profile.SpendingConsistency = toFloat(trustResp.Metrics["spending_consistency"])
	profile.EMIDiscipline = toFloat(trustResp.Metrics["emi_discipline"])
	profile.BalanceScore = toFloat(trustResp.Metrics["balance_score"])
	profile.ScoreStatus = "provisional"
	if profile.IntakeSource == "" {
		profile.IntakeSource = "quick_estimate"
	}
	profile.Summary = explainResp.Summary
	if err := h.db.Save(&profile).Error; err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"trust_score":     trustResp.TrustScore,
		"risk_score":      riskResp.RiskScore,
		"risk_category":   riskResp.RiskCategory,
		"score_status":    profile.ScoreStatus,
		"intake_source":   profile.IntakeSource,
		"recommendations": recommendations,
		"flags":           []string{},
		"explanations":    explainResp,
	})
}

func (h *Handler) getDashboard(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("userID")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid user id")
	}
	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "user not found")
	}
	var profile models.FinancialProfile
	if err := h.db.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		return err
	}
	var transactions []models.Transaction
	if err := h.db.Where("user_id = ?", userID).Order("timestamp asc").Find(&transactions).Error; err != nil {
		return err
	}

	categoryTotals := map[string]float64{}
	monthlyIncome := map[string]float64{}
	monthlySpending := map[string]float64{}
	balanceTrend := []map[string]any{}

	for _, txn := range transactions {
		if txn.Type == "debit" {
			categoryTotals[txn.Category] += math.Abs(txn.Amount)
			monthlySpending[txn.Timestamp.Format("2006-01")] += math.Abs(txn.Amount)
		} else {
			monthlyIncome[txn.Timestamp.Format("2006-01")] += math.Abs(txn.Amount)
		}
		balanceTrend = append(balanceTrend, map[string]any{
			"date":    txn.Timestamp.Format("2006-01-02"),
			"balance": txn.Balance,
		})
	}

	categories := make([]map[string]any, 0, len(categoryTotals))
	for category, amount := range categoryTotals {
		categories = append(categories, map[string]any{"category": category, "amount": round2(amount)})
	}
	sort.Slice(categories, func(i, j int) bool {
		return categories[i]["amount"].(float64) > categories[j]["amount"].(float64)
	})

	monthlySeries := []map[string]any{}
	for month, income := range monthlyIncome {
		monthlySeries = append(monthlySeries, map[string]any{
			"month":    month,
			"income":   round2(income),
			"spending": round2(monthlySpending[month]),
		})
	}
	sort.Slice(monthlySeries, func(i, j int) bool {
		return monthlySeries[i]["month"].(string) < monthlySeries[j]["month"].(string)
	})

	response := dashboardResponse{}
	response.User.ID = user.ID
	response.User.Name = user.Name
	response.User.City = user.City
	response.User.EmploymentType = user.EmploymentType
	response.User.MonthlyIncome = user.MonthlyIncome
	response.Metrics = map[string]any{
		"trust_score":          profile.TrustScore,
		"risk_score":           profile.RiskScore,
		"risk_category":        profile.RiskCategory,
		"score_status":         profile.ScoreStatus,
		"intake_source":        profile.IntakeSource,
		"default_probability":  profile.DefaultProbability,
		"repayment_confidence": profile.RepaymentConfidence,
		"dti_ratio":            profile.DTIRatio,
		"monthly_income":       profile.MonthlyIncome,
		"monthly_spending":     profile.MonthlySpending,
		"average_balance":      profile.AvgBalance,
		"income_stability":     profile.IncomeStability,
		"spending_consistency": profile.SpendingConsistency,
		"emi_discipline":       profile.EMIDiscipline,
		"loan_purpose":         profile.LoanPurpose,
		"loan_amount_needed":   profile.LoanAmountNeeded,
		"urgency":              profile.Urgency,
		"use_case":             profile.UseCase,
		"summary":              profile.Summary,
	}
	response.Charts = map[string]any{
		"category_breakdown": categories,
		"monthly_series":     monthlySeries,
		"balance_trend":      balanceTrend,
	}
	if profile.ScoreStatus == "provisional" {
		response.Charts["category_breakdown"] = []map[string]any{}
		response.Charts["monthly_series"] = []map[string]any{}
		response.Charts["balance_trend"] = []map[string]any{}
	}
	response.Flags = []string{}
	return c.JSON(response)
}

func (h *Handler) getRecommendations(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("userID")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid user id")
	}
	var recommendations []models.Recommendation
	if err := h.db.Preload("Lender").Where("user_id = ?", userID).Order("rank asc").Find(&recommendations).Error; err != nil {
		return err
	}
	return c.JSON(fiber.Map{"recommendations": recommendations})
}

func (h *Handler) getExplanations(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("userID")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid user id")
	}
	var profile models.FinancialProfile
	if err := h.db.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		return err
	}
	return c.JSON(fiber.Map{
		"summary":       profile.Summary,
		"trust_score":   profile.TrustScore,
		"risk_score":    profile.RiskScore,
		"risk_category": profile.RiskCategory,
		"score_status":  profile.ScoreStatus,
		"intake_source": profile.IntakeSource,
		"weights": []map[string]any{
			{"name": "Income Stability", "weight": 40, "value": round2(profile.IncomeStability)},
			{"name": "EMI Discipline", "weight": 25, "value": round2(profile.EMIDiscipline)},
			{"name": "Average Balance", "weight": 20, "value": round2(profile.BalanceScore)},
			{"name": "Spending Consistency", "weight": 15, "value": round2(profile.SpendingConsistency)},
		},
	})
}

func (h *Handler) computeRecommendations(userID uint, user models.User, trustScore, dti float64, scoreStatus, intakeSource string) ([]map[string]any, error) {
	var lenders []models.Lender
	if err := h.db.Find(&lenders).Error; err != nil {
		return nil, err
	}
	if err := h.db.Where("user_id = ?", userID).Delete(&models.Recommendation{}).Error; err != nil {
		return nil, err
	}

	// Pull loan amount from profile for amount-range checks
	var profile models.FinancialProfile
	h.db.Where("user_id = ?", userID).First(&profile)
	requestedAmount := profile.LoanAmountNeeded

	type scored struct {
		lender      models.Lender
		probability float64
		explanation string
	}
	var scoredResults []scored
	for _, lender := range lenders {
		// --- Hard filters ---
		// Employment type gate
		if lender.EmploymentType != "Any" && !strings.EqualFold(lender.EmploymentType, user.EmploymentType) {
			continue
		}
		// Age gate
		if lender.MinAge > 0 && user.Age > 0 && user.Age < lender.MinAge {
			continue
		}
		if lender.MaxAge > 0 && user.Age > 0 && user.Age > lender.MaxAge {
			continue
		}
		// Loan amount gate
		if requestedAmount > 0 {
			if lender.MaxLoanAmount > 0 && requestedAmount > lender.MaxLoanAmount {
				continue
			}
			if lender.MinLoanAmount > 0 && requestedAmount < lender.MinLoanAmount {
				continue
			}
		}
		// Thin-file gate: if lender requires CIBIL and borrower has no bureau data, skip unless ThinFileOk
		if lender.MinCIBILScore > 0 && !lender.ThinFileOk && trustScore < 45 {
			continue
		}

		// --- Scoring ---
		score := 55.0
		score += clampPart((trustScore-lender.MinTrustScore)*1.1, -20, 25)
		score += clampPart((user.MonthlyIncome-lender.MinIncome)/2000, -20, 15)
		score += clampPart((lender.MaxDTI-dti)*1.2, -25, 20)
		// Thin-file bonus: lenders that accept no-bureau profiles get a boost for low-trust borrowers
		if lender.ThinFileOk && trustScore < 55 {
			score += 5
		}
		if scoreStatus == "provisional" {
			score -= 8
		}
		probability := round2(math.Max(5, math.Min(98, score)))
		if probability < 35 {
			continue
		}

		// --- Rich explanation ---
		explanation := fmt.Sprintf(
			"%s is a %s offering INR %s-INR %s at %.1f%%-%.1f%% p.a. "+
				"Disbursal: %s. Processing fee: %.1f%%-%.1f%%. "+
				"Matched on trust score %.0f, monthly income INR %.0f, and DTI %.1f%%.",
			lender.Name,
			lender.LenderType,
			formatLakh(lender.MinLoanAmount),
			formatLakh(lender.MaxLoanAmount),
			lender.InterestRateMin,
			lender.InterestRateMax,
			lender.DisbursalSpeed,
			lender.ProcessingFeeMin,
			lender.ProcessingFeeMax,
			trustScore,
			user.MonthlyIncome,
			dti,
		)
		scoredResults = append(scoredResults, scored{lender: lender, probability: probability, explanation: explanation})
	}
	sort.Slice(scoredResults, func(i, j int) bool {
		return scoredResults[i].probability > scoredResults[j].probability
	})

	recommendationPayloads := make([]map[string]any, 0, len(scoredResults))
	for idx, result := range scoredResults {
		rec := models.Recommendation{
			UserID:              userID,
			LenderID:            result.lender.ID,
			ApprovalProbability: result.probability,
			Explanation:         result.explanation,
			InterestRateRange:   fmt.Sprintf("%.1f%% - %.1f%%", result.lender.InterestRateMin, result.lender.InterestRateMax),
			Rank:                idx + 1,
			ScoreStatus:         scoreStatus,
			IntakeSource:        intakeSource,
		}
		if err := h.db.Create(&rec).Error; err != nil {
			return nil, err
		}
		recommendationPayloads = append(recommendationPayloads, map[string]any{
			"name":                 result.lender.Name,
			"lender_type":          result.lender.LenderType,
			"description":          result.lender.Description,
			"website":              result.lender.Website,
			"approval_probability": result.probability,
			"interest_rate_range":  rec.InterestRateRange,
			"min_loan_amount":      result.lender.MinLoanAmount,
			"max_loan_amount":      result.lender.MaxLoanAmount,
			"min_tenure_months":    result.lender.MinTenureMonths,
			"max_tenure_months":    result.lender.MaxTenureMonths,
			"processing_fee_range": fmt.Sprintf("%.1f%% - %.1f%%", result.lender.ProcessingFeeMin, result.lender.ProcessingFeeMax),
			"disbursal_speed":      result.lender.DisbursalSpeed,
			"thin_file_ok":         result.lender.ThinFileOk,
			"explanation":          result.explanation,
			"rank":                 idx + 1,
			"score_status":         scoreStatus,
			"intake_source":        intakeSource,
		})
	}
	return recommendationPayloads, nil
}

func formatLakh(amount float64) string {
	if amount >= 100000 {
		return fmt.Sprintf("%.0fL", amount/100000)
	}
	if amount >= 1000 {
		return fmt.Sprintf("%.0fK", amount/1000)
	}
	return fmt.Sprintf("%.0f", amount)
}

func parseCSV(fileHeader *multipart.FileHeader) ([]models.Transaction, error) {
	file, err := fileHeader.Open()
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.TrimLeadingSpace = true
	headers, err := reader.Read()
	if err != nil {
		return nil, fmt.Errorf("read csv headers: %w", err)
	}
	indexMap := map[string]int{}
	for idx, header := range headers {
		indexMap[strings.ToLower(strings.TrimSpace(header))] = idx
	}

	requiredAny := [][]string{
		{"date", "timestamp"},
		{"amount"},
		{"narration", "description", "remarks"},
	}
	for _, group := range requiredAny {
		found := false
		for _, key := range group {
			if _, ok := indexMap[key]; ok {
				found = true
				break
			}
		}
		if !found {
			return nil, fmt.Errorf("csv missing required column group: %s", strings.Join(group, "/"))
		}
	}

	var transactions []models.Transaction
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("read csv row: %w", err)
		}
		dateValue := getByAliases(record, indexMap, "date", "timestamp")
		amountValue := getByAliases(record, indexMap, "amount")
		narrationValue := getByAliases(record, indexMap, "narration", "description", "remarks")
		balanceValue := getByAliases(record, indexMap, "balance", "closing_balance")
		typeValue := getByAliases(record, indexMap, "type", "transaction_type", "dr_cr")

		amount, err := parseNumber(amountValue)
		if err != nil {
			continue
		}
		balance, _ := parseNumber(balanceValue)
		timestamp, err := parseDate(dateValue)
		if err != nil {
			continue
		}
		transactions = append(transactions, models.Transaction{
			Amount:    amount,
			Type:      normalizeTxnType(typeValue, amount),
			Narration: narrationValue,
			Timestamp: timestamp,
			Balance:   balance,
		})
	}
	return transactions, nil
}

func getByAliases(record []string, indexMap map[string]int, aliases ...string) string {
	for _, alias := range aliases {
		if idx, ok := indexMap[alias]; ok && idx < len(record) {
			return strings.TrimSpace(record[idx])
		}
	}
	return ""
}

func parseNumber(value string) (float64, error) {
	clean := strings.ReplaceAll(value, ",", "")
	clean = strings.ReplaceAll(clean, "INR", "")
	clean = strings.ReplaceAll(clean, "Rs.", "")
	clean = strings.ReplaceAll(clean, "Rs", "")
	clean = strings.TrimSpace(clean)
	if clean == "" {
		return 0, nil
	}
	return strconv.ParseFloat(clean, 64)
}

func parseDate(value string) (time.Time, error) {
	formats := []string{
		"2006-01-02",
		"02-01-2006",
		"02/01/2006",
		"2006/01/02",
		time.RFC3339,
	}
	for _, format := range formats {
		if ts, err := time.Parse(format, strings.TrimSpace(value)); err == nil {
			return ts, nil
		}
	}
	return time.Time{}, fmt.Errorf("unsupported date format: %s", value)
}

func normalizeTxnType(raw string, amount float64) string {
	value := strings.ToLower(strings.TrimSpace(raw))
	switch value {
	case "credit", "cr", "deposit", "inflow":
		return "credit"
	case "debit", "dr", "withdrawal", "outflow":
		return "debit"
	}
	if amount >= 0 {
		return "credit"
	}
	return "debit"
}

func toAITransactions(transactions []models.Transaction) []map[string]any {
	items := make([]map[string]any, 0, len(transactions))
	for _, txn := range transactions {
		items = append(items, map[string]any{
			"id":        txn.ID,
			"amount":    txn.Amount,
			"type":      txn.Type,
			"narration": txn.Narration,
			"timestamp": txn.Timestamp.Format("2006-01-02"),
			"balance":   txn.Balance,
		})
	}
	return items
}

func clampPart(value, minValue, maxValue float64) float64 {
	if value < minValue {
		return minValue
	}
	if value > maxValue {
		return maxValue
	}
	return value
}

func toFloat(value any) float64 {
	switch v := value.(type) {
	case float64:
		return v
	case float32:
		return float64(v)
	case int:
		return float64(v)
	case int64:
		return float64(v)
	default:
		return 0
	}
}

func round2(value float64) float64 {
	return math.Round(value*100) / 100
}
