package generator

import (
	"fmt"
	"github.com/brianvoe/gofakeit"
	"github.com/jinzhu/gorm"
	"github.com/pakflame/backend/models"
	"math/rand"
	"time"
)

type data struct{}

func New() *data {
	return &data{}
}

func (data *data) createClient(connection *gorm.DB) *models.Client {
	client := &models.Client{ClientName: "Abbasi.co"}
	connection.Create(client)
	return client
}

func (data *data) createClientConfiguration(connection *gorm.DB, client *models.Client) {
	clientConfiguration := &models.ClientConfiguration{ClientId: client.ID}
	connection.Create(clientConfiguration)
}

func (data *data) createUsers(connection *gorm.DB, client *models.Client) {
	connection.Create(&models.User{
		Username:  "nabbasi",
		Password:  "x",
		FirstName: "Noman Ali",
		LastName:  "Abbasi",
		ClientId:  client.ID,
	})
	connection.Create(&models.User{
		Username:  "mabbasi",
		Password:  "786",
		FirstName: "Musaveer Ali",
		LastName:  "Abbasi",
		ClientId:  client.ID,
	})
}

func (data *data) createWarehouses(connection *gorm.DB, client *models.Client) {
	connection.Create(&models.Warehouse{
		Name:         gofakeit.Company(),
		Location:     gofakeit.Address().Address,
		Email:        gofakeit.Contact().Email,
		MobileNumber: gofakeit.PhoneFormatted(),
		Status:       "Active",
		ClientId:     client.ID,
	})
	connection.Create(&models.Warehouse{
		Name:         gofakeit.Company(),
		Location:     gofakeit.Address().Address,
		Email:        gofakeit.Contact().Email,
		MobileNumber: gofakeit.PhoneFormatted(),
		Status:       "Closed",
		ClientId:     client.ID,
	})
}

func (data *data) createCustomers(connection *gorm.DB, client *models.Client) {
	for num := 0; num < 10; num++ {
		gofakeit.Seed(time.Now().UnixNano())
		customer := &models.Customer{}
		customer.FirstName = gofakeit.FirstName()
		customer.LastName = gofakeit.LastName()
		customer.MobileNumber = gofakeit.PhoneFormatted()
		customer.Address = gofakeit.Address().Address
		customer.OrderStatus = "In Process"
		customer.ShopName = gofakeit.FirstName()
		customer.ClientId = client.ID
		connection.Create(&customer)
	}
}

func (data *data) createWorkers(connection *gorm.DB, client *models.Client) {
	for num := 0; num < 10; num++ {
		gofakeit.Seed(time.Now().UnixNano())
		worker := &models.Worker{}
		worker.FirstName = gofakeit.FirstName()
		worker.LastName = gofakeit.LastName()
		worker.WorkingStatus = "Working"
		worker.MobileNumber = gofakeit.PhoneFormatted()
		worker.Address = gofakeit.Address().Address
		worker.ClientId = client.ID
		connection.Create(&worker)
	}
}

func (data *data) createCompanies(connection *gorm.DB, client *models.Client) *models.Company {
	company := &models.Company{}
	company.CompanyName = "PakFlame"
	company.MobileNumber = "03012525461"
	company.ClientId = client.ID
	connection.Create(company)
	return company
}

func (data *data) createInventories(company *models.Company, connection *gorm.DB, client *models.Client) {
	for num := 0; num < 25; num++ {
		gofakeit.Seed(time.Now().UnixNano())
		inventory := &models.Inventory{}
		inventory.ItemName = gofakeit.Name()
		inventory.ItemStatus = "Available"
		inventory.Quantities = uint64(rand.Intn(100))
		inventory.QuantityAlert = uint64(rand.Intn(10))
		inventory.WholesaleRate = float64(rand.Int63n(1000))
		inventory.PurchaseRate = float64(rand.Int63n(1000))
		inventory.RetailRate = float64(rand.Int63n(1000))
		inventory.CompanyId = company.ID
		inventory.ClientId = client.ID
		connection.Create(&inventory)
	}
}

func (data *data) createProducts(connection *gorm.DB, client *models.Client) {
	for num := 0; num < 5; num++ {
		connection.Create(&models.Product{
			ProductName:       fmt.Sprintf("Geyser - 000%d", num),
			ProductType:       "Geyser",
			ProductPrice:      float64(rand.Int63n(1000)),
			ProductDiscount:   0,
			ProductModel:      fmt.Sprintf("GMDL - 000%d", num),
			ProductDate:       time.Time{},
			ProductStatus:     "Available",
			ProductQuantities: uint64(rand.Int63n(1000)),
			ClientId:          client.ID,
		})
	}

	for num := 0; num < 5; num++ {
		connection.Create(&models.Product{
			ProductName:       fmt.Sprintf("Stove - 000%d", num),
			ProductType:       "Stove",
			ProductPrice:      float64(rand.Int63n(1000)),
			ProductDiscount:   float64(num),
			ProductModel:      fmt.Sprintf("SMDL - 000%d", num),
			ProductDate:       time.Time{},
			ProductStatus:     "Available",
			ProductQuantities: uint64(rand.Int63n(1000)),
			ClientId:          client.ID,
		})
	}
}

func (data *data) Import(connection *gorm.DB) {
	client := data.createClient(connection)
	data.createClientConfiguration(connection, client)
	data.createUsers(connection, client)
	data.createCustomers(connection, client)
	data.createWorkers(connection, client)
	data.createWarehouses(connection, client)
	data.createProducts(connection, client)
	company := data.createCompanies(connection, client)
	data.createInventories(company, connection, client)
}
