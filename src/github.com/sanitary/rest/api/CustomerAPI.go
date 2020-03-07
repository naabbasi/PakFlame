package api

import (
	"fmt"
	"github.com/google/uuid"
	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/models"
	"github.com/sanitary/config"
	"github.com/sanitary/util/http_util"
	"net/http"
)

const (
	CustomerEndPoint = "/api/customers"
)

func init() {
	log.Print("Customer  REST API initialized")
}

type customers struct {
	echo       *echo.Group
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewCustomer(e *echo.Group) *customers {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &customers{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (customer *customers) GetCustomers() {
	customer.echo.GET(CustomerEndPoint, func(c echo.Context) error {
		var allCustomer = new([]models.Customer)
		connection := customer.dbSettings.GetDBConnection()
		connection.Select("id, first_name, last_name, mobile_number, status, shop_name,"+
			" address").
			Where("client_id = ? ", http_util.GetUserInfo(c).ClientId).
			Order("first_name ASC").
			Find(&allCustomer)

		return c.JSON(http.StatusOK, &allCustomer)
	})
}

func (customer *customers) GetCustomerById() {
	customer.echo.GET(CustomerEndPoint+"/:id", func(c echo.Context) error {
		var findCustomer = new(models.Customer)
		customerId := c.Param("id")
		connection := customer.dbSettings.GetDBConnection()
		connection.Table("customers").Where("id = ? and client_id = ?", customerId, http_util.GetUserInfo(c).ClientId).
			First(&findCustomer)
		return c.JSON(http.StatusOK, &findCustomer)
	})
}

func (customer *customers) AddCustomer() {
	customer.echo.POST(CustomerEndPoint, func(c echo.Context) error {
		newCustomer := new(models.Customer)
		if err := c.Bind(newCustomer); err != nil {
			return err
		}
		log.Printf("Customer saved with %s", newCustomer)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			newCustomer.ClientId = clientId
		}

		connection := customer.dbSettings.GetDBConnection()
		save := connection.Save(newCustomer)

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, "Customer has been added")
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

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			updateCustomer.ClientId = clientId
		}

		connection := customer.dbSettings.GetDBConnection()
		update := connection.Model(models.Customer{}).Where("id = ? and client_id = ?", updateCustomer.ID, updateCustomer.ClientId).Update(updateCustomer)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "Customer has been added")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update customer")
		}
	})
}

func (customer *customers) DeleteCustomer() {
	customer.echo.DELETE(CustomerEndPoint+"/:id", func(c echo.Context) error {

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, fmt.Sprintf("Unable to parse client id: %s", clientId))
		}

		connection := customer.dbSettings.GetDBConnection()
		delete := connection.Where("id = ? and client_id = ?", c.Param("id"), clientId).Delete(models.Customer{})

		if delete.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "Customer has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete customer")
		}
	})
}
