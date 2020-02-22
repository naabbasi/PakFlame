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
	PaymentEndPoint = "/api/payments"
)

func init() {
	log.Print("Payment REST API initialized")
}

type payment struct {
	echo       *echo.Group
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewPayment(e *echo.Group) *payment {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &payment{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (payment *payment) AddPayment() {
	payment.echo.POST(PaymentEndPoint, func(c echo.Context) error {
		newPayment := new(models.Payment)
		if err := c.Bind(newPayment); err != nil {
			return err
		}
		log.Printf("Payment saved with %s", newPayment)

		connection := payment.dbSettings.GetDBConnection()
		save := connection.Save(newPayment)

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, "Payment has been added")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to save new Payment")
		}
	})
}

func (payment *payment) UpdatePayment() {
	payment.echo.PUT(PaymentEndPoint, func(c echo.Context) error {
		updatePayment := new(models.Payment)
		if err := c.Bind(updatePayment); err != nil {
			return err
		}
		log.Printf("Payment updated with %s", updatePayment)

		connection := payment.dbSettings.GetDBConnection()
		update := connection.Model(models.Payment{}).Where("id = ?", updatePayment.EntityId).Update(updatePayment)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "Payment has been updated")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update Payment")
		}
	})
}

func (payment *payment) DeletePayment() {
	payment.echo.DELETE(PaymentEndPoint, func(c echo.Context) error {
		deletePayment := new(models.Payment)
		if err := c.Bind(deletePayment); err != nil {
			return err
		}
		log.Printf("payment deleted with %s", deletePayment)

		connection := payment.dbSettings.GetDBConnection()
		update := connection.Model(models.Payment{}).Delete(deletePayment)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "Payment has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete Payment")
		}
	})
}

func (payment *payment) GetPaymentsById() {
	payment.echo.GET(PaymentEndPoint+"/:entityId", func(c echo.Context) error {
		paymentId := c.Param("entityId")
		var allpayment = new([]models.Payment)
		connection := payment.dbSettings.GetDBConnection()
		connection.Find(&allpayment, "entity_id = ?", &paymentId)
		return c.JSON(http.StatusOK, allpayment)
	})
}
