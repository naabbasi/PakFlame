package api

import (
	"github.com/darzi/backend/models"
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
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

var allCustomer = make([]models.Customer, 10)

func NewCustomer(e *echo.Echo) *customers {
	return &customers{echo: e}
}

func (customer *customers) GetCustomers() {
	customer.echo.GET(CustomerEndPoint, func(c echo.Context) error {
		var customer = [...]models.Customer{
			{
				Status: "active",
				Person: models.Person{FirstName: "Noman Ali", LastName: "Abbasi", MobileNumber: "03012525461"},
			}, {
				Status: "delivered",
				Person: models.Person{FirstName: "Farhan Ali", LastName: "Abbasi", MobileNumber: "03012525461"},
			}, {
				Status: "in_progress",
				Person: models.Person{FirstName: "Arsalan Ali", LastName: "Abbasi", MobileNumber: "03012525461"},
			},
		}

		return c.JSON(http.StatusOK, customer)
	})
}

func (customer *customers) AddCustomer() {
	customer.echo.POST(CustomerEndPoint, func(c echo.Context) error {
		customer := new(models.Customer)
		if err := c.Bind(customer); err != nil {
			return err
		}
		log.Printf("Customer saved with %s", customer)

		return c.JSON(http.StatusCreated, customer)
	})
}

func (customer *customers) DeleteCustomer() {
	customer.echo.DELETE(CustomerEndPoint, func(c echo.Context) error {
		customer := new(models.Customer)
		if err := c.Bind(customer); err != nil {
			return err
		}
		log.Printf("Customer deleted with %s", customer.FirstName)

		return c.JSON(http.StatusOK, customer)
	})
}
