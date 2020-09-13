package main

import (
	"flag"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/schema"
	"github.com/sanitary/config"
	"github.com/sanitary/util/generator"
)

// import _ "github.com/jinzhu/gorm/dialects/mysql"
// import _ "github.com/jinzhu/gorm/dialects/postgres"
// import _ "github.com/jinzhu/gorm/dialects/sqlite"
// import _ "github.com/jinzhu/gorm/dialects/mssql"

func main() {

	config := config.NewConfig()
	runMigration := flag.Bool("migration", false, "To run migration")
	dropSchema := flag.Bool("drop", false, "To drop schema")
	flag.Parse()

	db := backend.GetDBSettings(config)
	connection := db.GetDBConnection()

	if *runMigration {
		connection.Exec("CREATE SEQUENCE invoice_seq")
		schema.CreatePostgreSQLSchema(connection)
	} else if *dropSchema {
		schema.DropSchema(connection)
	}

	data := generator.New()
	data.Import(connection)
}
