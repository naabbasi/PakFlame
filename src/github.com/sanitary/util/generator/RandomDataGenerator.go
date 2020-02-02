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

func (data *data) CreateClient(connection *gorm.DB) *models.Client {
	client := &models.Client{ClientName: "Abbasi.co"}
	connection.Create(client)
	return client
}

func (data *data) CreateClientConfiguration(connection *gorm.DB, client *models.Client) {
	clientConfiguration := &models.ClientConfiguration{ClientId: client.ID}
	connection.Create(clientConfiguration)
}

func (data *data) CreateUsers(connection *gorm.DB, client *models.Client) {
	connection.Create(&models.User{
		Username:  "nabbasi",
		Password:  "x",
		FirstName: "Noman Ali",
		LastName:  "Abbasi",
		ClientId:  client.ID,
	})
	connection.Create(&models.User{
		Username:  "waris",
		Password:  "786",
		FirstName: "Abdul Waris",
		LastName:  "Zai",
		ClientId:  client.ID,
	})
}

func (data *data) CreateCustomers(connection *gorm.DB, client *models.Client) {
	for num := 0; num < 1000; num++ {
		gofakeit.Seed(time.Now().UnixNano())
		customer := &models.Customer{}
		customer.FirstName = gofakeit.FirstName()
		customer.LastName = gofakeit.LastName()
		customer.MobileNumber = gofakeit.Contact().Phone
		customer.Status = "in_process"
		customer.ShopName = gofakeit.FirstName()
		customer.ClientId = client.ID
		connection.Create(&customer)
	}
}

func (data *data) CreateWorkers(connection *gorm.DB, client *models.Client) {
	for num := 0; num < 1000; num++ {
		gofakeit.Seed(time.Now().UnixNano())
		worker := &models.Worker{}
		worker.FirstName = gofakeit.FirstName()
		worker.LastName = gofakeit.LastName()
		worker.Status = "Working"
		worker.MobileNumber = gofakeit.PhoneFormatted()
		worker.ClientId = client.ID
		connection.Create(&worker)
	}
}

func (data *data) CreateCompanies(connection *gorm.DB, client *models.Client) *models.Company {
	company := &models.Company{}
	company.CompanyName = "Company 1"
	company.MobileNumber = "03012525461"
	company.ClientId = client.ID
	connection.Create(company)
	return company
}

func (data *data) CreateInventories(company *models.Company, connection *gorm.DB, client *models.Client) {
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
		inventory.ClientId = client.ID
		connection.Create(&inventory)
	}
}
