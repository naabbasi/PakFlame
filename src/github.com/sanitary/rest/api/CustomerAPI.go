package api

import (
	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/models"
	"github.com/sanitary/config"
	"net/http"
)

const (
	CustomerEndPoint = "/api/customers"
)

func init() {
	log.Print("Customer  REST API initialized")
}

type customers struct {
	echo       *echo.Echo
	config     *config.Config
	dbSettings *backend.DBSettings
}

var allCustomer []*models.Customer

func NewCustomer(e *echo.Echo) *customers {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &customers{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (customer *customers) GetCustomers() {
	customer.echo.GET(CustomerEndPoint, func(c echo.Context) error {
		if customer.config.DemoData == true {
			customers := []*models.Customer{
				{
					Status: "active",
					Person: models.Person{FirstName: "Noman Ali", LastName: "Abbasi", MobileNumber: "03012525461"},
				},
				{
					Status: "active",
					Person: models.Person{FirstName: "Farhan Ali", LastName: "REST", MobileNumber: "03012525461"},
				},
				{
					Status: "active",
					Person: models.Person{FirstName: "Arsalan Ali", LastName: "REST", MobileNumber: "03012525461"},
				},
			}

			if len(allCustomer) == 0 {
				allCustomer = append(allCustomer, customers...)
			}

			return c.JSON(http.StatusOK, allCustomer)
		} else {
			connection := customer.dbSettings.GetDBConnection()
			connection.Find(&allCustomer)
			return c.JSON(http.StatusOK, &allCustomer)
		}
	})
}

func (customer *customers) AddCustomer() {
	customer.echo.POST(CustomerEndPoint, func(c echo.Context) error {
		newCustomer := new(models.Customer)
		if err := c.Bind(newCustomer); err != nil {
			return err
		}
		log.Printf("Customer saved with %s", newCustomer)

		connection := customer.dbSettings.GetDBConnection()
		save := connection.Save(newCustomer)

		if save.RowsAffected == 1 {
			allCustomer = append(allCustomer, newCustomer)
			return c.JSON(http.StatusCreated, allCustomer)
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to save new customer")
		}
	})
}

func (customer *customers) UpdateCustomer() {
	customer.echo.PUT(CustomerEndPoint, func(c echo.Context) error {
		updateCustomer := new(models.Customer)
		if err := c.Bind(updateCustomer); err != nil {
			return err
		}

		log.Printf("Customer updated with %s", updateCustomer)

		connection := customer.dbSettings.GetDBConnection()
		update := connection.Model(models.Customer{}).Where("id = ?", updateCustomer.ID).Update(updateCustomer)

		if update.RowsAffected == 1 {
			allCustomer = append(allCustomer, updateCustomer)
			return c.JSON(http.StatusAccepted, allCustomer)
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update customer")
		}
	})
}

func (customer *customers) DeleteCustomer() {
	customer.echo.DELETE(CustomerEndPoint, func(c echo.Context) error {
		deleteCustomer := new(models.Customer)
		if err := c.Bind(deleteCustomer); err != nil {
			return err
		}
		log.Printf("Worker deleted with %s", deleteCustomer.FirstName)

		connection := customer.dbSettings.GetDBConnection()
		update := connection.Model(models.Customer{}).Delete(deleteCustomer)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, allCustomer)
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update worker")
		}
	})
}
