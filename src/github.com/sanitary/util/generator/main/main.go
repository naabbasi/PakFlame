package main

import (
	"flag"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/schema"
	"github.com/sanitary/config"
	"github.com/sanitary/util/generator"
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
	data.CreateUsers(connection)
	data.CreateCustomers(connection)
	data.CreateWorkers(connection)
	company := data.CreateCompanies(connection)
	data.CreateInventories(company, connection)
}
