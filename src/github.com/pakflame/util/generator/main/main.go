package main

import (
	"flag"
	"github.com/pakflame/backend"
	"github.com/pakflame/backend/schema"
	"github.com/pakflame/config"
	"github.com/pakflame/util/generator"
)

func main() {
	config := config.NewConfig()
	runMigration := flag.Bool("migration", false, "To run migration")
	flag.Parse()

	db := backend.GetDBSettings(config)
	connection := db.GetDBConnection()

	if *runMigration {
		connection.Exec("CREATE SEQUENCE invoice_seq")
		schema.CreatePostgreSQLSchema(connection)
	}

	data := generator.New()
	data.Import(connection)
}
