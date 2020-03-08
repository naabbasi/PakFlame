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

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, fmt.Sprintf("Unable to parse client id: %s", clientId))
		}

		newPayment.ClientId = clientId
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

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, fmt.Sprintf("Unable to parse client id: %s", clientId))
		}

		connection := payment.dbSettings.GetDBConnection()
		update := connection.Model(models.Payment{}).Where("id = ? and client_id = ?", updatePayment.EntityId, clientId).Update(updatePayment)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "Payment has been updated")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update Payment")
		}
	})
}

func (payment *payment) DeletePayment() {
	payment.echo.DELETE(PaymentEndPoint+"/:entityId/:paymentId", func(c echo.Context) error {
		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, fmt.Sprintf("Unable to parse client id: %s", clientId))
		}

		connection := payment.dbSettings.GetDBConnection()
		delete := connection.Where("id = ? and entity_id = ? and client_id = ?", c.Param("paymentId"), c.Param("entityId"), clientId).Delete(models.Payment{})

		if delete.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "Payment has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete Payment")
		}
	})
}

func (payment *payment) GetPaymentsById() {
	payment.echo.GET(PaymentEndPoint+"/:entityId", func(c echo.Context) error {
		paymentId := c.Param("entityId")
		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, fmt.Sprintf("Unable to parse client id: %s", clientId))
		}

		var allpayment = new([]models.Payment)
		connection := payment.dbSettings.GetDBConnection()
		connection.Find(&allpayment, "entity_id = ? and client_id = ?", &paymentId, clientId)
		return c.JSON(http.StatusOK, allpayment)
	})
}
