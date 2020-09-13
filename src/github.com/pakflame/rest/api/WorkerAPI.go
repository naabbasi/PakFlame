package api

import (
	"fmt"
	"github.com/google/uuid"
	"github.com/labstack/echo"
	"github.com/pakflame/backend"
	"github.com/pakflame/backend/models"
	"github.com/pakflame/config"
	"github.com/pakflame/util/http_util"
	"log"
	"net/http"
)

const (
	WorkerEndPoint = "/api/workers"
)

func init() {
	log.Print("Worker  REST API initialized")
}

type workers struct {
	echo       *echo.Group
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewWorker(e *echo.Group) workers {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return workers{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (worker *workers) Get() {
	worker.echo.GET(WorkerEndPoint, func(c echo.Context) error {
		var allWorkers = new([]models.Worker)
		connection := worker.dbSettings.GetDBConnection()
		connection.
			Where("client_id = ? ", http_util.GetUserInfo(c).ClientId).
			Order("first_name ASC").
			Find(&allWorkers)
		return c.JSON(http.StatusOK, &allWorkers)
	})
}

func (worker *workers) GetWorkerById() {
	worker.echo.GET(WorkerEndPoint+"/:id", func(c echo.Context) error {
		var findWorker = new(models.Worker)
		workerId := c.Param("id")
		connection := worker.dbSettings.GetDBConnection()
		connection.Table("workers").Where("id = ? and client_id = ?", workerId, http_util.GetUserInfo(c).ClientId).
			First(&findWorker)
		return c.JSON(http.StatusOK, &findWorker)
	})
}

func (worker *workers) AddWorker() {
	worker.echo.POST(WorkerEndPoint, func(c echo.Context) error {
		newWorker := new(models.Worker)
		if err := c.Bind(newWorker); err != nil {
			return err
		}
		log.Printf("Worker saved with %s", newWorker.FirstName)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			newWorker.ClientId = clientId
		}

		connection := worker.dbSettings.GetDBConnection()
		save := connection.Save(newWorker)

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, "Worker has been updated")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to save new worker")
		}
	})
}

func (worker *workers) UpdateWorker() {
	worker.echo.PUT(WorkerEndPoint, func(c echo.Context) error {
		updateWorker := new(models.Worker)
		if err := c.Bind(updateWorker); err != nil {
			return err
		}
		log.Printf("Worker saved with %s", updateWorker.FirstName)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			updateWorker.ClientId = clientId
		}

		connection := worker.dbSettings.GetDBConnection()
		update := connection.Model(models.Worker{}).Where("id = ? and client_id = ?", updateWorker.ID, updateWorker.ClientId).Update(updateWorker)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "Worker has been updated")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update worker")
		}
	})
}

func (worker *workers) DeleteWorker() {
	worker.echo.DELETE(WorkerEndPoint+"/:id", func(c echo.Context) error {
		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, fmt.Sprintf("Unable to parse client id: %s", clientId))
		}

		connection := worker.dbSettings.GetDBConnection()
		delete := connection.Where("id = ? and client_id = ?", c.Param("id"), clientId).Delete(models.Worker{})

		if delete.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "Work has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update worker")
		}
	})
}
