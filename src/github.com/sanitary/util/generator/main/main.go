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
	client := data.CreateClient(connection)
	data.CreateClientConfiguration(connection, client)
	data.CreateUsers(connection, client)
	data.CreateCustomers(connection, client)
	data.CreateWorkers(connection, client)
	company := data.CreateCompanies(connection, client)
	data.CreateInventories(company, connection, client)
}
