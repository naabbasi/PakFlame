package api

import (
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
	"github.com/sanitary/backend/models"
	"net/http"
)

const (
	CustomerEndPoint = "/api/customers"
)

func init() {
	log.Print("Customer initialized")
}

type customers struct {
	db   *gorm.DB
	echo *echo.Echo
}

var allCustomer []*models.Customer

func NewCustomer(e *echo.Echo) *customers {
	return &customers{echo: e}
}

func (customer *customers) GetCustomers() {
	customer.echo.GET(CustomerEndPoint, func(c echo.Context) error {
		customers := []*models.Customer{
			{
				Status: "active",
				Person: models.Person{FirstName: "Noman Ali", LastName: "Abbasi", MobileNumber: "03012525461",
					Model: models.Model{ID: 1},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Farhan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 2},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Arsalan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 3},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Noman Ali", LastName: "Abbasi", MobileNumber: "03012525461",
					Model: models.Model{ID: 1},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Farhan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 2},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Arsalan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 3},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Noman Ali", LastName: "Abbasi", MobileNumber: "03012525461",
					Model: models.Model{ID: 1},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Farhan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 2},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Arsalan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 3},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Noman Ali", LastName: "Abbasi", MobileNumber: "03012525461",
					Model: models.Model{ID: 1},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Farhan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 2},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Arsalan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 3},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Noman Ali", LastName: "Abbasi", MobileNumber: "03012525461",
					Model: models.Model{ID: 1},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Farhan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 2},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Arsalan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 3},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Noman Ali", LastName: "Abbasi", MobileNumber: "03012525461",
					Model: models.Model{ID: 1},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Farhan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 2},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Arsalan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 3},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Noman Ali", LastName: "Abbasi", MobileNumber: "03012525461",
					Model: models.Model{ID: 1},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Farhan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 2},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Arsalan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 3},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Noman Ali", LastName: "Abbasi", MobileNumber: "03012525461",
					Model: models.Model{ID: 1},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Farhan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 2},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Arsalan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 3},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Noman Ali", LastName: "Abbasi", MobileNumber: "03012525461",
					Model: models.Model{ID: 1},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Farhan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 2},
				},
			},
			{
				Status: "active",
				Person: models.Person{FirstName: "Arsalan Ali", LastName: "REST", MobileNumber: "03012525461",
					Model: models.Model{ID: 3},
				},
			},
		}

		if len(allCustomer) == 0 {
			allCustomer = append(allCustomer, customers...)
		}

		return c.JSON(http.StatusOK, allCustomer)
	})
}

func (customer *customers) AddCustomer() {
	customer.echo.POST(CustomerEndPoint, func(c echo.Context) error {
		cus := new(models.Customer)
		if err := c.Bind(cus); err != nil {
			return err
		}
		log.Printf("Customer saved with %s", cus)

		allCustomer = append(allCustomer, cus)
		return c.JSON(http.StatusCreated, allCustomer)
	})
}

func (customer *customers) UpdateCustomer() {
	customer.echo.PUT(CustomerEndPoint, func(c echo.Context) error {
		cus := new(models.Customer)
		if err := c.Bind(cus); err != nil {
			return err
		}
		log.Printf("Customer updated with %s", cus)

		allCustomer = append(allCustomer, cus)
		return c.JSON(http.StatusOK, allCustomer)
	})
}

func (customer *customers) DeleteCustomer() {
	customer.echo.DELETE(CustomerEndPoint, func(c echo.Context) error {
		customer := new(models.Customer)
		if err := c.Bind(customer); err != nil {
			return err
		}
		log.Printf("Customer deleted with %s", customer)

		return c.JSON(http.StatusNoContent, customer)
	})
}
