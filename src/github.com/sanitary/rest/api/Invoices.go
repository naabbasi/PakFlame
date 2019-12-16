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
	InvoiceEndPoint = "/api/invoices"
)

func init() {
	log.Print("Invoices  REST API initialized")
}

type invoices struct {
	echo       *echo.Echo
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewInvoice(e *echo.Echo) *invoices {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &invoices{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (invoices *invoices) Getinvoices() {
	invoices.echo.GET(InvoiceEndPoint, func(c echo.Context) error {
		var getInvoices = new([]models.Invoice)
		connection := invoices.dbSettings.GetDBConnection()
		connection.Find(&getInvoices)
		return c.JSON(http.StatusOK, &getInvoices)
	})
}

func (invoices *invoices) AddInvoice() {
	invoices.echo.POST(InvoiceEndPoint, func(c echo.Context) error {
		newInvoice := new(models.Invoice)
		if err := c.Bind(newInvoice); err != nil {
			return err
		}
		log.Printf("Invoice saved with %s", newInvoice)

		connection := invoices.dbSettings.GetDBConnection()
		save := connection.Save(newInvoice)

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, "Invoice has been added")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to save new Invoice")
		}
	})
}

func (invoices *invoices) UpdateInvoice() {
	invoices.echo.PUT(InvoiceEndPoint, func(c echo.Context) error {
		updateInvoice := new(models.Invoice)
		if err := c.Bind(updateInvoice); err != nil {
			return err
		}

		log.Printf("Invoice updated with %s", updateInvoice)

		connection := invoices.dbSettings.GetDBConnection()
		update := connection.Model(models.Invoice{}).Where("id = ?", updateInvoice.ID).Update(updateInvoice)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "Invoice has been added")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update Invoice")
		}
	})
}

func (invoices *invoices) DeleteInvoice() {
	invoices.echo.DELETE(InvoiceEndPoint, func(c echo.Context) error {
		deleteInvoice := new(models.Invoice)
		if err := c.Bind(deleteInvoice); err != nil {
			return err
		}
		log.Printf("Invoice deleted with %s", deleteInvoice.ID)

		connection := invoices.dbSettings.GetDBConnection()
		update := connection.Model(models.Invoice{}).Delete(deleteInvoice)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "Invoice has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete Invoice")
		}
	})
}
