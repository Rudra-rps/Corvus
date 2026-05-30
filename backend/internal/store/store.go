package store

import (
	"fmt"
	"strings"

	"corvus/backend/internal/config"
	"corvus/backend/internal/models"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func OpenDatabase(cfg config.Config) (*gorm.DB, error) {
	if strings.HasPrefix(cfg.DatabaseURL, "postgres://") || strings.HasPrefix(cfg.DatabaseURL, "postgresql://") {
		return gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
	}
	path := strings.TrimPrefix(cfg.DatabaseURL, "sqlite://")
	return gorm.Open(sqlite.Open(path), &gorm.Config{})
}

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.FinancialProfile{},
		&models.Transaction{},
		&models.Lender{},
		&models.Recommendation{},
	)
}

func SeedLenders(db *gorm.DB) error {
	lenders := []models.Lender{
		{
			Name: "KreditBee", LenderType: "Fintech NBFC",
			Description: "India's leading digital personal loan platform for salaried and self-employed, known for fast disbursal via app.",
			Website:     "https://kreditbee.in",
			MinIncome:   10000, MaxDTI: 50, MinTrustScore: 40,
			InterestRateMin: 16, InterestRateMax: 29.95,
			MinLoanAmount: 1000, MaxLoanAmount: 300000,
			MinTenureMonths: 2, MaxTenureMonths: 24,
			MinAge: 21, MaxAge: 50, MinCIBILScore: 0,
			ProcessingFeeMin: 0, ProcessingFeeMax: 6,
			DisbursalSpeed: "Same Day", GeographyTier: "All",
			EmploymentType: "Any", ThinFileOk: true,
		},
		{
			Name: "MoneyView", LenderType: "Fintech NBFC",
			Description: "App-based personal loans with quick credit decisions. Uses bank statement and bureau data for underwriting.",
			Website:     "https://moneyview.in",
			MinIncome:   13500, MaxDTI: 50, MinTrustScore: 45,
			InterestRateMin: 15.96, InterestRateMax: 39.99,
			MinLoanAmount: 5000, MaxLoanAmount: 500000,
			MinTenureMonths: 6, MaxTenureMonths: 60,
			MinAge: 21, MaxAge: 57, MinCIBILScore: 600,
			ProcessingFeeMin: 2, ProcessingFeeMax: 8,
			DisbursalSpeed: "Same Day", GeographyTier: "All",
			EmploymentType: "Any", ThinFileOk: false,
		},
		{
			Name: "Navi", LenderType: "Fintech NBFC",
			Description: "Sachet personal loans from Navi Technologies. App-first, low ticket, fast approval with minimal documentation.",
			Website:     "https://navi.com",
			MinIncome:   15000, MaxDTI: 45, MinTrustScore: 42,
			InterestRateMin: 9.9, InterestRateMax: 45,
			MinLoanAmount: 10000, MaxLoanAmount: 2000000,
			MinTenureMonths: 3, MaxTenureMonths: 72,
			MinAge: 21, MaxAge: 55, MinCIBILScore: 650,
			ProcessingFeeMin: 0, ProcessingFeeMax: 3.5,
			DisbursalSpeed: "Same Day", GeographyTier: "All",
			EmploymentType: "Salaried", ThinFileOk: false,
		},
		{
			Name: "Fibe (EarlySalary)", LenderType: "Fintech NBFC",
			Description: "Salary advance and short-term personal loans for young salaried professionals. Strong Tier-1/2 city presence.",
			Website:     "https://fibe.in",
			MinIncome:   20000, MaxDTI: 50, MinTrustScore: 50,
			InterestRateMin: 14, InterestRateMax: 30,
			MinLoanAmount: 8000, MaxLoanAmount: 500000,
			MinTenureMonths: 3, MaxTenureMonths: 24,
			MinAge: 21, MaxAge: 45, MinCIBILScore: 0,
			ProcessingFeeMin: 1, ProcessingFeeMax: 3,
			DisbursalSpeed: "Within 24 Hours", GeographyTier: "Tier1+Tier2",
			EmploymentType: "Salaried", ThinFileOk: true,
		},
		{
			Name: "CASHe", LenderType: "Fintech NBFC",
			Description: "AI-driven personal loan app targeting millennials. Uses social profile + salary slip. No CIBIL required.",
			Website:     "https://cashe.co.in",
			MinIncome:   15000, MaxDTI: 55, MinTrustScore: 38,
			InterestRateMin: 27, InterestRateMax: 33,
			MinLoanAmount: 1000, MaxLoanAmount: 400000,
			MinTenureMonths: 1, MaxTenureMonths: 18,
			MinAge: 23, MaxAge: 58, MinCIBILScore: 0,
			ProcessingFeeMin: 1.75, ProcessingFeeMax: 3,
			DisbursalSpeed: "Within 24 Hours", GeographyTier: "All",
			EmploymentType: "Salaried", ThinFileOk: true,
		},
		{
			Name: "Stashfin", LenderType: "Fintech NBFC",
			Description: "Credit line and personal loans via a Visa-powered card. Works for both salaried and self-employed borrowers.",
			Website:     "https://stashfin.com",
			MinIncome:   15000, MaxDTI: 50, MinTrustScore: 42,
			InterestRateMin: 11.99, InterestRateMax: 59.99,
			MinLoanAmount: 1000, MaxLoanAmount: 500000,
			MinTenureMonths: 3, MaxTenureMonths: 36,
			MinAge: 18, MaxAge: 60, MinCIBILScore: 0,
			ProcessingFeeMin: 0, ProcessingFeeMax: 5,
			DisbursalSpeed: "Same Day", GeographyTier: "All",
			EmploymentType: "Any", ThinFileOk: true,
		},
		{
			Name: "LoanTap", LenderType: "NBFC",
			Description: "Flexible personal loans with customizable EMI options including step-up, bullet, and overdraft structures.",
			Website:     "https://loantap.in",
			MinIncome:   30000, MaxDTI: 40, MinTrustScore: 58,
			InterestRateMin: 18, InterestRateMax: 30,
			MinLoanAmount: 50000, MaxLoanAmount: 1000000,
			MinTenureMonths: 6, MaxTenureMonths: 60,
			MinAge: 23, MaxAge: 58, MinCIBILScore: 685,
			ProcessingFeeMin: 2, ProcessingFeeMax: 3,
			DisbursalSpeed: "2-3 Days", GeographyTier: "Tier1+Tier2",
			EmploymentType: "Salaried", ThinFileOk: false,
		},
		{
			Name: "InCred Finance", LenderType: "NBFC",
			Description: "New-age NBFC offering personal, education, and SME loans. Known for data-driven credit models and fair pricing.",
			Website:     "https://incred.com",
			MinIncome:   25000, MaxDTI: 45, MinTrustScore: 55,
			InterestRateMin: 16, InterestRateMax: 36,
			MinLoanAmount: 75000, MaxLoanAmount: 750000,
			MinTenureMonths: 12, MaxTenureMonths: 60,
			MinAge: 23, MaxAge: 60, MinCIBILScore: 650,
			ProcessingFeeMin: 2, ProcessingFeeMax: 5,
			DisbursalSpeed: "2-3 Days", GeographyTier: "All",
			EmploymentType: "Any", ThinFileOk: false,
		},
		{
			Name: "Poonawalla Fincorp", LenderType: "NBFC",
			Description: "Well-regulated NBFC backed by Cyrus Poonawalla Group. Competitive rates for salaried borrowers with good bureau history.",
			Website:     "https://poonawallafincorp.com",
			MinIncome:   20000, MaxDTI: 40, MinTrustScore: 60,
			InterestRateMin: 9.99, InterestRateMax: 24,
			MinLoanAmount: 100000, MaxLoanAmount: 3000000,
			MinTenureMonths: 12, MaxTenureMonths: 60,
			MinAge: 22, MaxAge: 58, MinCIBILScore: 700,
			ProcessingFeeMin: 1, ProcessingFeeMax: 3,
			DisbursalSpeed: "2-3 Days", GeographyTier: "All",
			EmploymentType: "Any", ThinFileOk: false,
		},
		{
			Name: "PaySense (LazyPay)", LenderType: "Fintech NBFC",
			Description: "PayU-backed digital lender offering instant loans and BNPL. Strong in smaller cities with low documentation.",
			Website:     "https://gopaysense.com",
			MinIncome:   12000, MaxDTI: 55, MinTrustScore: 40,
			InterestRateMin: 18, InterestRateMax: 36,
			MinLoanAmount: 5000, MaxLoanAmount: 500000,
			MinTenureMonths: 3, MaxTenureMonths: 60,
			MinAge: 21, MaxAge: 60, MinCIBILScore: 0,
			ProcessingFeeMin: 1.5, ProcessingFeeMax: 3,
			DisbursalSpeed: "Within 24 Hours", GeographyTier: "All",
			EmploymentType: "Any", ThinFileOk: true,
		},
		{
			Name: "Prefr (DMI Finance)", LenderType: "Fintech NBFC",
			Description: "DMI Finance's digital lending arm. Targets thin-file and moderate credit profiles across Tier-2/3 cities.",
			Website:     "https://prefr.com",
			MinIncome:   15000, MaxDTI: 50, MinTrustScore: 42,
			InterestRateMin: 15, InterestRateMax: 36,
			MinLoanAmount: 50000, MaxLoanAmount: 500000,
			MinTenureMonths: 12, MaxTenureMonths: 48,
			MinAge: 23, MaxAge: 56, MinCIBILScore: 0,
			ProcessingFeeMin: 1, ProcessingFeeMax: 4,
			DisbursalSpeed: "2-3 Days", GeographyTier: "All",
			EmploymentType: "Any", ThinFileOk: true,
		},
		{
			Name: "IDFC FIRST Bank", LenderType: "Bank",
			Description: "Full-service private bank with competitive personal loan rates. Requires solid bureau history but offers the lowest rates in market.",
			Website:     "https://idfcfirstbank.com",
			MinIncome:   20000, MaxDTI: 40, MinTrustScore: 65,
			InterestRateMin: 10.49, InterestRateMax: 23.99,
			MinLoanAmount: 100000, MaxLoanAmount: 4000000,
			MinTenureMonths: 12, MaxTenureMonths: 60,
			MinAge: 21, MaxAge: 60, MinCIBILScore: 700,
			ProcessingFeeMin: 1.5, ProcessingFeeMax: 3.5,
			DisbursalSpeed: "3-5 Days", GeographyTier: "All",
			EmploymentType: "Salaried", ThinFileOk: false,
		},
		{
			Name: "Bajaj Finserv", LenderType: "NBFC",
			Description: "India's largest NBFC by assets. Personal loans with pre-approved offers, flexible repayment, and widespread branch network.",
			Website:     "https://bajajfinserv.in",
			MinIncome:   25000, MaxDTI: 40, MinTrustScore: 62,
			InterestRateMin: 13, InterestRateMax: 31,
			MinLoanAmount: 100000, MaxLoanAmount: 4000000,
			MinTenureMonths: 12, MaxTenureMonths: 84,
			MinAge: 21, MaxAge: 68, MinCIBILScore: 685,
			ProcessingFeeMin: 0, ProcessingFeeMax: 3.93,
			DisbursalSpeed: "Same Day", GeographyTier: "All",
			EmploymentType: "Any", ThinFileOk: false,
		},
		{
			Name: "SmartCoin", LenderType: "Fintech NBFC",
			Description: "Micro personal loans targeting underserved Tier-2/3 salaried users with thin credit files. Fully app-driven.",
			Website:     "https://smartcoin.co.in",
			MinIncome:   8000, MaxDTI: 60, MinTrustScore: 35,
			InterestRateMin: 20, InterestRateMax: 45,
			MinLoanAmount: 1000, MaxLoanAmount: 100000,
			MinTenureMonths: 1, MaxTenureMonths: 12,
			MinAge: 21, MaxAge: 55, MinCIBILScore: 0,
			ProcessingFeeMin: 0, ProcessingFeeMax: 5,
			DisbursalSpeed: "Same Day", GeographyTier: "All",
			EmploymentType: "Salaried", ThinFileOk: true,
		},
		{
			Name: "Zype", LenderType: "Fintech NBFC",
			Description: "Formerly GetVantage's consumer arm. Offers instant credit lines and personal loans through a slick mobile-first experience.",
			Website:     "https://zype.in",
			MinIncome:   15000, MaxDTI: 50, MinTrustScore: 43,
			InterestRateMin: 18, InterestRateMax: 42,
			MinLoanAmount: 2000, MaxLoanAmount: 300000,
			MinTenureMonths: 3, MaxTenureMonths: 24,
			MinAge: 21, MaxAge: 55, MinCIBILScore: 0,
			ProcessingFeeMin: 1, ProcessingFeeMax: 4,
			DisbursalSpeed: "Within 24 Hours", GeographyTier: "All",
			EmploymentType: "Any", ThinFileOk: true,
		},
	}

	return db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.Recommendation{}).Error; err != nil {
			return fmt.Errorf("clear recommendations: %w", err)
		}
		if err := tx.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.Lender{}).Error; err != nil {
			return fmt.Errorf("clear lenders: %w", err)
		}
		if err := tx.Create(&lenders).Error; err != nil {
			return fmt.Errorf("seed lenders: %w", err)
		}
		return nil
	})
}
