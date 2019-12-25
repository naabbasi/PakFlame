package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/models"
	"github.com/sanitary/backend/schema"
	"github.com/sanitary/config"
	"math/rand"
	"strconv"
	"time"
)

// import _ "github.com/jinzhu/gorm/dialects/mysql"
// import _ "github.com/jinzhu/gorm/dialects/postgres"
// import _ "github.com/jinzhu/gorm/dialects/sqlite"
// import _ "github.com/jinzhu/gorm/dialects/mssql"

func main() {
	//db, err := gorm.Open("postgres", "username=root host=127.0.0.1 port=")
	/*db, err := gorm.Open("mysql", "root:Password1@/sanitary?charset=utf8&parseTime=True&loc=Local")

	if err != nil {
		fmt.Println("Error: " + err.Error())
		fmt.Println("Not Working :(")
	}

	defer db.Close()*/

	config := config.NewConfig()
	db := backend.GetDBSettings(config)
	connection := db.GetDBConnection()
	connection.Exec("CREATE SEQUENCE invoice_seq")
	schema.CreatePostgreSQLSchema(connection)

	createUsers(connection)
	createCustomers(connection)
	createWorkers(connection)
	company := createCompanies(connection)
	createInventories(company, connection)

	//schema.DropSchema(connection)
}

func randomName() string {
	names := []string{"\uFDF2", "Rehmat Ali", "Imtiaz Ali", "Noman Ali", "Farhan Ali", "Arsalan Ali", "Aijaz Ali", "Nabeel Ali", "Nafees Ali", "Zaheer Ali", "Nadeem Ali"}
	return names[rand.Intn(10)]
}

func createCustomers(connection *gorm.DB) {
	for num := 0; num < 100; num++ {
		customer := &models.Customer{}
		customer.FirstName = randomName()
		customer.LastName = "Abbasi"
		customer.MobileNumber = fmt.Sprintf("0301%d", rand.Int63n(time.Now().Unix()))
		customer.Status = "in_process"
		customer.ShopName = randomName()
		amount, _ := strconv.ParseFloat(fmt.Sprintf("%d", rand.Int63n(time.Now().Unix())), 64)
		customer.Amount = amount
		customer.Remaining = amount
		customer.Total = amount
		connection.Create(&customer)
	}
}

func createWorkers(connection *gorm.DB) {
	for num := 0; num < 100; num++ {
		worker := &models.Worker{}
		worker.FirstName = randomName()
		worker.LastName = "Abbasi"
		worker.Status = "Working"
		worker.MobileNumber = fmt.Sprintf("0301%d", rand.Int63n(time.Now().Unix()))
		worker.Amount = float64(rand.Int63n(time.Now().Unix()))
		worker.Remaining = float64(rand.Int63n(time.Now().Unix()))
		worker.Total = float64(rand.Int63n(time.Now().Unix()))
		connection.Create(&worker)
	}
}

func createCompanies(connection *gorm.DB) *models.Company {
	company := &models.Company{}
	company.CompanyName = "Company 1"
	company.MobileNumber = "03012525461"
	connection.Create(company)
	return company
}

func createInventories(company *models.Company, connection *gorm.DB) {
	for num := 0; num < 100; num++ {
		inventory := &models.Inventory{}
		inventory.ItemName = randomName()
		inventory.ItemStatus = "Active"
		inventory.Quantities = uint64(rand.Intn(1000))
		inventory.QuantityAlert = uint64(rand.Intn(10))
		inventory.WholesaleRate = float64(rand.Int63n(time.Now().Unix()))
		inventory.PurchaseRate = float64(rand.Int63n(time.Now().Unix()))
		inventory.RetailRate = float64(rand.Int63n(time.Now().Unix()))
		inventory.CompanyId = company.ID
		connection.Create(&inventory)
	}
}

func createUsers(connection *gorm.DB) {
	connection.Create(&models.User{Username: "nabbasi", Password: "x"})
	connection.Create(&models.User{Username: "waris", Password: "786"})
}
