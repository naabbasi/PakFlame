package generator

import (
	"github.com/brianvoe/gofakeit"
	"github.com/jinzhu/gorm"
	"github.com/sanitary/backend/models"
	"math/rand"
	"time"
)

type data struct{}

func New() *data {
	return &data{}
}

func (data *data) CreateUsers(connection *gorm.DB) {
	connection.Create(&models.User{
		Username:  "nabbasi",
		Password:  "x",
		FirstName: "Noman Ali",
		LastName:  "Abbasi",
	})
	connection.Create(&models.User{
		Username:  "waris",
		Password:  "786",
		FirstName: "Abdul Waris",
		LastName:  "Zai",
	})
}

func (data *data) CreateCustomers(connection *gorm.DB) {
	for num := 0; num < 1000; num++ {
		gofakeit.Seed(time.Now().UnixNano())
		customer := &models.Customer{}
		customer.FirstName = gofakeit.FirstName()
		customer.LastName = gofakeit.LastName()
		customer.MobileNumber = gofakeit.Contact().Phone
		customer.Status = "in_process"
		customer.ShopName = gofakeit.FirstName()
		connection.Create(&customer)
	}
}

func (data *data) CreateWorkers(connection *gorm.DB) {
	for num := 0; num < 1000; num++ {
		gofakeit.Seed(time.Now().UnixNano())
		worker := &models.Worker{}
		worker.FirstName = gofakeit.FirstName()
		worker.LastName = gofakeit.LastName()
		worker.Status = "Working"
		worker.MobileNumber = gofakeit.PhoneFormatted()
		connection.Create(&worker)
	}
}

func (data *data) CreateCompanies(connection *gorm.DB) *models.Company {
	company := &models.Company{}
	company.CompanyName = "Company 1"
	company.MobileNumber = "03012525461"
	connection.Create(company)
	return company
}

func (data *data) CreateInventories(company *models.Company, connection *gorm.DB) {
	for num := 0; num < 5000; num++ {
		gofakeit.Seed(time.Now().UnixNano())
		inventory := &models.Inventory{}
		inventory.ItemName = gofakeit.Name()
		inventory.ItemStatus = "Available"
		inventory.Quantities = uint64(rand.Intn(1000))
		inventory.QuantityAlert = uint64(rand.Intn(10))
		inventory.WholesaleRate = float64(rand.Int63n(time.Now().Unix()))
		inventory.PurchaseRate = float64(rand.Int63n(time.Now().Unix()))
		inventory.RetailRate = float64(rand.Int63n(time.Now().Unix()))
		inventory.CompanyId = company.ID
		connection.Create(&inventory)
	}
}
