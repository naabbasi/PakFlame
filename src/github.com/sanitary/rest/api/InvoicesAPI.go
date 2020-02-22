package api

import (
	"fmt"
	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/models"
	"github.com/sanitary/config"
	"github.com/sanitary/util/pdf/generate"
	"net/http"
	"strconv"
)

const (
	InvoiceEndPoint = "/api/invoices"
)

func init() {
	log.Print("Invoices  REST API initialized")
}

type invoices struct {
	echo       *echo.Group
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewInvoice(e *echo.Group) *invoices {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &invoices{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (invoices *invoices) GetInvoices() {
	invoices.echo.GET(InvoiceEndPoint, func(c echo.Context) error {
		var getInvoices = new([]models.Invoice)
		connection := invoices.dbSettings.GetDBConnection()
		connection.Find(&getInvoices)
		return c.JSON(http.StatusOK, &getInvoices)
	})
}

func (invoices *invoices) GetInvoiceById() {
	invoices.echo.GET(InvoiceEndPoint+"/:id", func(c echo.Context) error {
		var getInvoice = new(models.Invoice)
		connection := invoices.dbSettings.GetDBConnection()
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		connection.Table("invoices").Where("id = ?", id).First(&getInvoice)

		if getInvoice.ID != 0 {
			return c.JSON(http.StatusOK, &getInvoice)
		} else {
			return c.JSON(http.StatusNotFound, "No invoice found")
		}
	})
}

func (invoices *invoices) PrintInvoice() {
	invoices.echo.GET(InvoiceEndPoint+"/print/:id", func(c echo.Context) error {
		connection := invoices.dbSettings.GetDBConnection()
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		//connection.Table("invoices").Where("id = ?", id).First(&getInvoice)

		result := new([]generate.Result)
		connection.Table("invoices").Select("invoices.*, invoice_details.*").
			Joins("inner join invoice_details on invoices.id = invoice_details.invoice_number").
			Where("id = ?", id).
			Find(result)

		generate.Pdf(result)
		return c.JSON(http.StatusOK, "Invoice printed successfully")
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

func (invoices *invoices) GetInvoiceDetailsById() {
	invoices.echo.GET(InvoiceEndPoint+"/details/:id", func(c echo.Context) error {
		var getInvoices = new([]models.InvoiceDetails)
		connection := invoices.dbSettings.GetDBConnection()
		invoiceId, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		connection.Table("invoice_details").Where("invoice_number = ?", invoiceId).Find(&getInvoices)

		return c.JSON(http.StatusOK, &getInvoices)
	})
}

func (invoices *invoices) AddInvoiceDetails() {
	invoices.echo.POST(InvoiceEndPoint+"/details", func(c echo.Context) error {
		newInvoice := new(models.Invoice)
		if err := c.Bind(newInvoice); err != nil {
			return err
		}
		log.Printf("Invoice saved with %s", newInvoice)

		connection := invoices.dbSettings.GetDBConnection()
		save := connection.Save(newInvoice)

		if save.RowsAffected == 1 {
			for _, newItem := range newInvoice.InvoiceDetails {
				connection := invoices.dbSettings.GetDBConnection()
				newItem.InvoiceNumber = newInvoice.ID
				saveItem := connection.Save(newItem)
				if saveItem.RowsAffected == 1 {
					fmt.Printf("Item: %v", newItem)
				}
			}

			return c.JSON(http.StatusCreated, "Invoice has been added")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to save new Invoice")
		}
	})
}

func (invoices *invoices) UpdateInvoiceDetail() {
	invoices.echo.PUT(InvoiceEndPoint+"/details", func(c echo.Context) error {
		updateInvoice := new(models.Invoice)
		if err := c.Bind(updateInvoice); err != nil {
			return err
		}

		log.Printf("Invoice updated with %s", updateInvoice)

		connection := invoices.dbSettings.GetDBConnection()
		update := connection.Model(models.Invoice{}).Where("id = ?", updateInvoice.ID).Update(updateInvoice)

		if update.RowsAffected == 1 {
			/*for _, newItem := range updateInvoice.InvoiceDetails {
				connection := invoices.dbSettings.GetDBConnection()
				newItem.InvoiceNumber = updateInvoice.ID
				saveItem := connection.Save(newItem)
				if saveItem.RowsAffected == 1 {
					fmt.Printf("Item: %v", newItem)
				}
			}*/

			return c.JSON(http.StatusAccepted, "Invoice has been added")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update Invoice")
		}
	})
}

func (invoices *invoices) DeleteInvoiceDetail() {
	invoices.echo.DELETE(InvoiceEndPoint+"/details", func(c echo.Context) error {
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
