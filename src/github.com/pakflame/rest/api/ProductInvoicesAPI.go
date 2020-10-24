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
	"math"
	"net/http"
	"strconv"
	"time"
)

type CustomerPayment struct {
	CustomerId uuid.UUID `json:"customerId" xml:"customerId" form:"customerId" query:"customerId"`
	models.Customer
	models.Payment
}

const (
	ProductInvoiceEndPoint = "/api/product_invoices"
)

func init() {
	log.Print("Product Invoice REST API initialized")
}

type productInvoices struct {
	echo       *echo.Group
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewProductInvoice(e *echo.Group) *productInvoices {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &productInvoices{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (productInvoices *productInvoices) GetProductInvoices() {
	productInvoices.echo.GET(ProductInvoiceEndPoint, func(c echo.Context) error {
		var getInvoices = new([]models.Invoice)
		connection := productInvoices.dbSettings.GetDBConnection()
		connection.Where("client_id = ?", http_util.GetUserInfo(c).ClientId).
			Order("id ASC").
			Find(&getInvoices)
		return c.JSON(http.StatusOK, &getInvoices)
	})
}

func (productInvoices *productInvoices) GetProductInvoiceById() {
	productInvoices.echo.GET(ProductInvoiceEndPoint+"/:id", func(c echo.Context) error {
		var getInvoice = new(models.Invoice)
		connection := productInvoices.dbSettings.GetDBConnection()
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

func (productInvoices *productInvoices) PaymentAgainstProductInvoice() {
	productInvoices.echo.POST(ProductInvoiceEndPoint+"/pay", func(c echo.Context) error {
		customerPayment := new(CustomerPayment)

		if err := c.Bind(customerPayment); err != nil {
			return err
		}
		log.Printf("Invoice payment entity: %v", customerPayment)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			customerPayment.Customer.ClientId = clientId
		}

		customerAdvanceAmount := customerPayment.Customer.AdvanceAmount
		customerRemainingAmount := customerPayment.Customer.RemainingAmount

		fmt.Printf("Customer: Avance: %.2f, Remaining: %.2f", customerAdvanceAmount, customerRemainingAmount)

		invoiceNumber := customerPayment.Payment.InvoiceNumber
		invoiceAmount := customerPayment.Payment.Amount
		invoiceRemaining := customerPayment.Payment.Remaining

		fmt.Printf("Payment: Number: %d, Amount: %.2f, Remaining: %.2f", invoiceNumber, invoiceAmount, invoiceRemaining)
		connection := productInvoices.dbSettings.GetDBConnection()
		//connection.Begin()

		invoice := new(models.Invoice)
		connection.Where("id = ? and client_id = ?", customerPayment.Payment.InvoiceNumber, customerPayment.Customer.ClientId).
			First(&invoice)

		customer := new(models.Customer)
		connection.Where("id = ? and client_id = ?", customerPayment.CustomerId, customerPayment.Customer.ClientId).
			First(&customer)

		if customer.ID != uuid.Nil {
			customer.AdvanceAmount = customerPayment.Customer.AdvanceAmount
			if customerPayment.Customer.RemainingAmount == 0 {
				customer.RemainingAmount = 0
			} else if customer.RemainingAmount != 0 {
				customer.RemainingAmount = customer.RemainingAmount - customerPayment.Payment.Amount
			} else {
				customer.RemainingAmount = customer.RemainingAmount - customerPayment.Payment.Amount
			}
			saveCustomer := connection.Save(&customer)
			if saveCustomer.RowsAffected == 1 {
				log.Print("Customer payment has been updated")
			}
		}

		payment := new(models.Payment)
		connection.Where("entity_id = ? and invoice_number = ? and client_id = ?", customerPayment.CustomerId, customerPayment.Payment.InvoiceNumber, customerPayment.Customer.ClientId).
			First(&payment)

		if payment.ID == uuid.Nil {
			payment.CreatedAt = time.Now()
			payment.InvoiceNumber = customerPayment.Payment.InvoiceNumber
			payment.EntityId = customerPayment.CustomerId
			payment.ClientId = customerPayment.Customer.ClientId
			payment.Amount = customerPayment.Payment.Amount
			payment.Remaining = customerPayment.Customer.RemainingAmount
			payment.Total = invoice.InvoiceAmount
			savePayment := connection.Save(&payment)

			if savePayment.RowsAffected == 1 {
				log.Print("Invoice payment has been added")
			}
		} else {
			payment.UpdatedAt = time.Now()
			if payment.Remaining == 0 {
				payment.Amount = customerPayment.Payment.Amount
				payment.Remaining = payment.Amount - customerPayment.Payment.Amount
			} else {
				payment.Amount = payment.Amount + customerPayment.Payment.Amount
				payment.Remaining = payment.Remaining - customerPayment.Payment.Amount
			}

			payment.Total = invoice.InvoiceAmount
			//updatePayment := connection.Table("payments").Where("id = ?", payment.ID).Update(&payment)
			updatePayment := connection.Save(&payment)
			if updatePayment.RowsAffected == 1 {
				log.Print("Invoice payment has been updated")
			}
		}

		if invoice.InvoicePaidAmount == 0 {
			invoice.InvoicePaidAmount = math.Abs(customerPayment.Payment.Amount)
		} else {
			invoice.InvoicePaidAmount = invoice.InvoicePaidAmount + math.Abs(customerPayment.Payment.Amount)
		}
		invoice.InvoiceRemainingAmount = invoice.InvoiceAmount - invoice.InvoicePaidAmount
		makeInvoiceReadonly := connection.Save(invoice)
		if makeInvoiceReadonly.RowsAffected == 1 {
			log.Print("Invoice has been set to readonly")
		}

		//connection.Commit()
		return c.JSON(http.StatusOK, "Invoice Payment successfully")
	})
}

func (productInvoices *productInvoices) PrintInvoice() {
	productInvoices.echo.GET(ProductInvoiceEndPoint+"/print/:id", func(c echo.Context) error {
		connection := productInvoices.dbSettings.GetDBConnection()
		id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

		result := new(generate.Result)
		connection.Where("id = ? and client_id = ?", id, http_util.GetUserInfo(c).ClientId).
			Find(&result.Invoice)

		connection.Where("invoice_number = ? and client_id = ?", id, http_util.GetUserInfo(c).ClientId).
			Find(&result.InvoiceDetails)

		generate.Pdf(result)

		customer := new(models.Customer)
		connection.Where("id = ? and client_id = ?", result.Invoice.CustomerId, http_util.GetUserInfo(c).ClientId).
			First(&customer)

		if customer.ID != uuid.Nil {
			if false == result.Invoice.Readonly {
				if customer.RemainingAmount != 0 {
					customer.RemainingAmount = customer.RemainingAmount + (result.InvoiceAmount + result.TransportCharges)
				} else {
					customer.RemainingAmount = result.Payment.Total
				}

				updateCustomerPayment := connection.Model(&customer).Updates(map[string]interface{}{"remaining_amount": customer.RemainingAmount})
				if updateCustomerPayment.RowsAffected == 1 {
					log.Print("Customer payment has been updated")
				}
			} else {
				log.Print("Invoice has been marked as Readonly so no update in customer payment")
			}
		}

		payment := new(models.Payment)
		connection.Where("entity_id = ? and invoice_number = ? and client_id = ?", result.Invoice.CustomerId, result.Invoice.ID, result.Invoice.ClientId).
			First(&payment)

		if payment.ID == uuid.Nil {
			result.Payment.CreatedAt = time.Now()
			result.Payment.InvoiceNumber = result.Invoice.ID
			result.Payment.Remaining = result.InvoiceAmount + result.TransportCharges
			result.Payment.EntityId = result.Invoice.CustomerId
			result.Payment.ClientId = result.Invoice.ClientId
			savePayment := connection.Save(&result.Payment)

			if savePayment.RowsAffected == 1 {
				log.Print("Invoice payment has been added")
			}
		} else {
			payment.UpdatedAt = time.Now()
			payment.Total = result.Payment.Total
			updatePayment := connection.Table("payments").Where("invoice_number = ?", result.Invoice.ID).Update(&payment)
			if updatePayment.RowsAffected == 1 {
				log.Print("Invoice payment has been updated")
			}
		}

		result.Readonly = true
		result.InvoiceAmount = result.Payment.Total
		result.InvoiceRemainingAmount = result.Payment.Total
		makeInvoiceReadonly := connection.Table("invoices").Where("id = ?", result.Invoice.ID).Update(&result.Invoice)
		if makeInvoiceReadonly.RowsAffected == 1 {
			log.Print("Invoice has been set to readonly")
		}

		makeInvoiceItemsReadonly := connection.Exec("update invoice_details set readonly = ? and invoice_number = ?", result.Readonly, result.Invoice.ID)
		if makeInvoiceItemsReadonly.RowsAffected > 0 {
			log.Print("Invoice items have been set to readonly")
		}

		return c.JSON(http.StatusOK, "Invoice printed successfully")
	})
}

func (productInvoices *productInvoices) AddProductInvoice() {
	productInvoices.echo.POST(ProductInvoiceEndPoint, func(c echo.Context) error {
		newInvoice := new(models.Invoice)
		if err := c.Bind(newInvoice); err != nil {
			return err
		}
		log.Printf("Invoice saved with %s", newInvoice)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			newInvoice.ClientId = clientId
		}

		connection := productInvoices.dbSettings.GetDBConnection()
		save := connection.Save(newInvoice)

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, http_util.CustomHttpResponse{Message: "Invoice has been added", Result: newInvoice})
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to save new Invoice")
		}
	})
}

func (productInvoices *productInvoices) UpdateProductInvoice() {
	productInvoices.echo.PUT(ProductInvoiceEndPoint, func(c echo.Context) error {
		updateInvoice := new(models.Invoice)
		if err := c.Bind(updateInvoice); err != nil {
			return err
		}

		log.Printf("Invoice updated with %s", updateInvoice)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			updateInvoice.ClientId = clientId
		}

		connection := productInvoices.dbSettings.GetDBConnection()
		update := connection.Model(models.Invoice{}).Where("id = ?", updateInvoice.ID).Update(updateInvoice)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "Invoice has been updated")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update Invoice")
		}
	})
}

func (productInvoices *productInvoices) DeleteProductInvoice() {
	productInvoices.echo.DELETE(ProductInvoiceEndPoint+"/:id", func(c echo.Context) error {
		deleteInvoice := new(models.Invoice)
		if err := c.Bind(deleteInvoice); err != nil {
			return err
		}
		log.Printf("Invoice deleted with %s", deleteInvoice.ID)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			deleteInvoice.ClientId = clientId
		}

		connection := productInvoices.dbSettings.GetDBConnection()
		update := connection.Model(models.Invoice{}).Where("id = ?", c.Param("id")).Delete(deleteInvoice)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "Invoice has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete Invoice")
		}
	})
}

func (productInvoices *productInvoices) GetInvoiceItemsById() {
	productInvoices.echo.GET(ProductInvoiceEndPoint+"/items/:id", func(c echo.Context) error {
		var getInvoices = new([]models.InvoiceDetails)
		connection := productInvoices.dbSettings.GetDBConnection()
		invoiceId, _ := strconv.ParseInt(c.Param("id"), 10, 64)
		connection.Table("invoice_details").Where("invoice_number = ? and client_id = ?", invoiceId, http_util.GetUserInfo(c).ClientId).Find(&getInvoices)

		return c.JSON(http.StatusOK, &getInvoices)
	})
}

func (productInvoices *productInvoices) AddInvoiceItem() {
	productInvoices.echo.POST(ProductInvoiceEndPoint+"/items", func(c echo.Context) error {
		newInvoiceItem := new(models.InvoiceDetails)
		if err := c.Bind(newInvoiceItem); err != nil {
			return err
		}
		log.Printf("Item saved with %v", newInvoiceItem)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			newInvoiceItem.ClientId = clientId
		}

		connection := productInvoices.dbSettings.GetDBConnection()

		//Update product table to update quantities
		product := new(models.Product)
		connection.Model(models.Product{}).Where("id = ?", newInvoiceItem.ItemId).First(product)
		remainingItemInInventory := product.ProductQuantities - newInvoiceItem.Quantities
		product.ProductQuantities = remainingItemInInventory
		updateItemInInventory := connection.Exec("update products set product_quantities = ? where id = ?", product.ProductQuantities, product.ID)

		//Update invoice amount
		var totalInvoiceAmount = 0.0
		connection.Select("sum(total_amount)").Where("invoice_number = ? ", newInvoiceItem.InvoiceNumber).Model(models.InvoiceDetails{}).Row().Scan(&totalInvoiceAmount)
		totalInvoiceAmount = totalInvoiceAmount + newInvoiceItem.TotalAmount
		connection.Exec("update invoices set invoice_amount = ? where id = ?", totalInvoiceAmount, newInvoiceItem.InvoiceNumber)

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

func (productInvoices *productInvoices) UpdateInvoiceItem() {
	productInvoices.echo.PUT(ProductInvoiceEndPoint+"/items", func(c echo.Context) error {
		updateInvoice := new(models.InvoiceDetails)
		if err := c.Bind(updateInvoice); err != nil {
			return err
		}

		log.Printf("Invoice updated with %s", updateInvoice)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			updateInvoice.ClientId = clientId
		}

		connection := productInvoices.dbSettings.GetDBConnection()
		update := connection.Model(models.Invoice{}).Where("id = ?", updateInvoice.ID).Update(updateInvoice)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "Invoice has been added")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update Invoice")
		}
	})
}

func (productInvoices *productInvoices) DeleteInvoiceItem() {
	productInvoices.echo.DELETE(ProductInvoiceEndPoint+"/items/:id", func(c echo.Context) error {
		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, fmt.Sprintf("Unable to parse client id: %s", clientId))
		}

		connection := productInvoices.dbSettings.GetDBConnection()

		invoiceDetails := new(models.InvoiceDetails)
		connection.Where("id = ?", c.Param("id")).Model(models.InvoiceDetails{}).First(invoiceDetails)

		if invoiceDetails.ID != uuid.Nil {
			//Update product inventory
			product := new(models.Product)
			connection.Where("id = ?", invoiceDetails.ItemId).Model(models.Product{}).First(product)
			productQuantity := product.ProductQuantities + invoiceDetails.Quantities
			connection.Exec("update products set product_quantities = ? where id = ?", productQuantity, invoiceDetails.ItemId)

			//Update invoice amount
			var totalInvoiceAmount = 0.0
			connection.Select("sum(total_amount)").Where("invoice_number = ? ", invoiceDetails.InvoiceNumber).Model(models.InvoiceDetails{}).Row().Scan(&totalInvoiceAmount)
			totalInvoiceAmount = totalInvoiceAmount - invoiceDetails.TotalAmount
			connection.Exec("update invoices set invoice_amount = ? where id = ?", totalInvoiceAmount, invoiceDetails.InvoiceNumber)

			delete := connection.Where("id = ? and client_id = ?", c.Param("id"), clientId).Delete(models.InvoiceDetails{})

			if delete.RowsAffected == 1 {
				return c.JSON(http.StatusNoContent, "Invoice item has been deleted")
			} else {
				return c.JSON(http.StatusInternalServerError, "Unable to delete Invoice item")
			}
		}

		return c.JSON(http.StatusNoContent, "Invoice item is already deleted")
	})
}
