package main

import (
	"log"

	"corvus/backend/internal/ai"
	"corvus/backend/internal/api"
	"corvus/backend/internal/config"
	"corvus/backend/internal/store"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	cfg := config.Load()

	db, err := store.OpenDatabase(cfg)
	if err != nil {
		log.Fatalf("open database: %v", err)
	}

	if err := store.AutoMigrate(db); err != nil {
		log.Fatalf("migrate database: %v", err)
	}

	if err := store.SeedLenders(db); err != nil {
		log.Fatalf("seed lenders: %v", err)
	}

	app := fiber.New(fiber.Config{
		AppName: "Corvus Backend",
	})
	app.Use(cors.New())

	aiClient := ai.NewClient(cfg.AIServiceURL)
	handler := api.NewHandler(db, aiClient)
	handler.Register(app)

	log.Printf("corvus backend listening on %s", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}
