package api

import (
	"fmt"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo"
	"github.com/pakflame/backend"
	"github.com/pakflame/backend/models"
	"github.com/pakflame/config"
	"github.com/pakflame/util/http_util"
	"github.com/pakflame/util/pdf/generate"
	"log"
	"net/http"
	"strconv"
	"time"
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
		connection.Where("client_id = ?", http_util.GetUserInfo(c).ClientId).
			Order("id ASC").
			Find(&getInvoices)
		return c.JSON(http.StatusOK, &getInvoices)
	})
}

func (invoices *invoices) GetInvoiceById() {
	invoices.echo.GET(InvoiceEndPoint+"/:id", func(c echo.Context) error {
		var getInvoice = new(models.Invoice)
		connection := invoices.dbSettings.GetDBConnection()
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		connection.Table("invoices").
			Where("id = ? and client_id = ?", id, http_util.GetUserInfo(c).ClientId).
			First(&getInvoice)

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

		result := new(generate.Result)
		connection.Where("id = ? and client_id = ?", id, http_util.GetUserInfo(c).ClientId).
			Find(&result.Invoice)

		result.Invoice.Readonly = true
		connection.Where("invoice_number = ? and client_id = ?", id, http_util.GetUserInfo(c).ClientId).
			Find(&result.InvoiceDetails)

		payment := new(models.Payment)
		connection.Where("entity_id = ? and client_id = ?", result.Invoice.CustomerId, result.Invoice.ClientId).
			First(&payment)

		generate.Pdf(result)

		if payment.ID == uuid.Nil {
			result.Payment.CreatedAt = time.Now()
			result.Payment.UpdatedAt = time.Now()
			result.Payment.EntityId = result.Invoice.CustomerId
			result.Payment.ClientId = result.Invoice.ClientId
			savePayment := connection.Save(&result.Payment)

			if savePayment.RowsAffected == 1 {
				log.Print("Invoice payment has been added")
			}
		} else {
			payment.Total = result.Payment.Total
			updatePayment := connection.Table("payments").Update(&payment)
			if updatePayment.RowsAffected == 1 {
				log.Print("Invoice payment has been updated")
			}
		}

		result.Readonly = true
		makeInvoiceRealonly := connection.Table("invoices").Update(&result.Invoice)
		if makeInvoiceRealonly.RowsAffected == 1 {
			log.Print("Invoice has been set to readonly")
		}

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

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			newInvoice.ClientId = clientId
		}

		connection := invoices.dbSettings.GetDBConnection()
		save := connection.Save(newInvoice)

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, http_util.CustomHttpResponse{Message: "Invoice has been added", Result: newInvoice})
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

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			updateInvoice.ClientId = clientId
		}

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
	invoices.echo.DELETE(InvoiceEndPoint+"/:id", func(c echo.Context) error {
		deleteInvoice := new(models.Invoice)
		if err := c.Bind(deleteInvoice); err != nil {
			return err
		}
		log.Printf("Invoice deleted with %s", deleteInvoice.ID)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			deleteInvoice.ClientId = clientId
		}

		connection := invoices.dbSettings.GetDBConnection()
		update := connection.Model(models.Invoice{}).Where("id = ?", c.Param("id")).Delete(deleteInvoice)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "Invoice has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete Invoice")
		}
	})
}

func (invoices *invoices) GetInvoiceItemsById() {
	invoices.echo.GET(InvoiceEndPoint+"/items/:id", func(c echo.Context) error {
		var getInvoices = new([]models.InvoiceDetails)
		connection := invoices.dbSettings.GetDBConnection()
		invoiceId, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		connection.Table("invoice_details").Where("invoice_number = ? and client_id = ?", invoiceId, http_util.GetUserInfo(c).ClientId).Find(&getInvoices)

		return c.JSON(http.StatusOK, &getInvoices)
	})
}

func (invoices *invoices) AddInvoiceItem() {
	invoices.echo.POST(InvoiceEndPoint+"/items", func(c echo.Context) error {
		newInvoiceItem := new(models.InvoiceDetails)
		if err := c.Bind(newInvoiceItem); err != nil {
			return err
		}
		log.Printf("Item saved with %s", newInvoiceItem)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			newInvoiceItem.ClientId = clientId
		}

		connection := invoices.dbSettings.GetDBConnection()

		//Update inventory table to update quantities
		itemInInventory := new(models.Inventory)
		connection.Model(models.Inventory{}).Where("id = ?", newInvoiceItem.ItemId).First(itemInInventory)
		remainingItemInInventory := itemInInventory.Quantities - newInvoiceItem.Quantities
		itemInInventory.Quantities = remainingItemInInventory
		updateItemInInventory := connection.Exec("update inventories set quantities = ? where id = ?", itemInInventory.Quantities, itemInInventory.ID)

		var save *gorm.DB
		if updateItemInInventory.RowsAffected == 1 {
			save = connection.Save(newInvoiceItem)
		}

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, http_util.CustomHttpResponse{
				Message: fmt.Sprintf("Item has been added into invoice number %d", newInvoiceItem.InvoiceNumber),
				Result:  newInvoiceItem.InvoiceNumber,
			})
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to save new Invoice")
		}
	})
}

func (invoices *invoices) UpdateInvoiceItem() {
	invoices.echo.PUT(InvoiceEndPoint+"/items", func(c echo.Context) error {
		updateInvoice := new(models.InvoiceDetails)
		if err := c.Bind(updateInvoice); err != nil {
			return err
		}

		log.Printf("Invoice updated with %s", updateInvoice)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			updateInvoice.ClientId = clientId
		}

		connection := invoices.dbSettings.GetDBConnection()
		update := connection.Model(models.Invoice{}).Where("id = ?", updateInvoice.ID).Update(updateInvoice)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "Invoice has been added")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update Invoice")
		}
	})
}

func (invoices *invoices) DeleteInvoiceItem() {
	invoices.echo.DELETE(InvoiceEndPoint+"/items/:id", func(c echo.Context) error {
		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, fmt.Sprintf("Unable to parse client id: %s", clientId))
		}

		connection := invoices.dbSettings.GetDBConnection()
		delete := connection.Where("id = ? and client_id = ?", c.Param("id"), clientId).Delete(models.InvoiceDetails{})

		if delete.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "Invoice has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete Invoice")
		}
	})
}
