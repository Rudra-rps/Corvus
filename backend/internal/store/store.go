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
	var count int64
	if err := db.Model(&models.Lender{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	lenders := []models.Lender{
		{Name: "FlexiLoan", MinIncome: 25000, MaxDTI: 45, MinTrustScore: 55, InterestRateMin: 12, InterestRateMax: 16, MaxLoanAmount: 500000, EmploymentType: "Any"},
		{Name: "IndiaLend", MinIncome: 30000, MaxDTI: 40, MinTrustScore: 60, InterestRateMin: 11, InterestRateMax: 15, MaxLoanAmount: 750000, EmploymentType: "Any"},
		{Name: "NeoCash", MinIncome: 40000, MaxDTI: 35, MinTrustScore: 70, InterestRateMin: 10, InterestRateMax: 13, MaxLoanAmount: 1200000, EmploymentType: "Salaried"},
		{Name: "Udaan Capital", MinIncome: 35000, MaxDTI: 42, MinTrustScore: 65, InterestRateMin: 12.5, InterestRateMax: 17, MaxLoanAmount: 900000, EmploymentType: "Self-Employed Professional"},
		{Name: "Bharat Finance", MinIncome: 20000, MaxDTI: 50, MinTrustScore: 50, InterestRateMin: 13, InterestRateMax: 18, MaxLoanAmount: 300000, EmploymentType: "Any"},
	}

	if err := db.Create(&lenders).Error; err != nil {
		return fmt.Errorf("seed lenders: %w", err)
	}
	return nil
}
