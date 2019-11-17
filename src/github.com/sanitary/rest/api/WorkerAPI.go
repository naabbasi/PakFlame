package api

import (
	"github.com/labstack/echo"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/models"
	"github.com/sanitary/config"
	"log"
	"net/http"
)

const (
	WorkerEndPoint = "/api/workers"
)

var allWorkers []*models.Worker

func init() {
	log.Print("Worker  REST API initialized")
}

type workers struct {
	echo       *echo.Echo
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewWorker(e *echo.Echo) workers {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return workers{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (worker *workers) Get() {
	worker.echo.GET(WorkerEndPoint, func(c echo.Context) error {
		if worker.config.DemoData == true {
			workers := []*models.Worker{
				{
					Status:  "working",
					Address: "H. NO 284, unit no 2 block d, Latifabad, Hyderabad",
					Person: models.Person{
						FirstName:    "Noman Ali",
						LastName:     "Abbasi",
						MobileNumber: "03012525461",
					},
				},
				{
					Status:  "working",
					Address: "H. NO 284, unit no 2 block d, Latifabad, Hyderabad",
					Person: models.Person{
						FirstName:    "Arsalan Ali",
						LastName:     "Abbasi",
						MobileNumber: "03012525461",
					},
				},
				{
					Status:  "working",
					Address: "H. NO 284, unit no 2 block d, Latifabad, Hyderabad",
					Person: models.Person{
						FirstName:    "Farhan Ali",
						LastName:     "Abbasi",
						MobileNumber: "03012525461",
					},
				},
			}

			if len(allWorkers) == 0 {
				allWorkers = append(allWorkers, workers...)
			}

			return c.JSON(http.StatusOK, &allWorkers)
		} else {
			connection := worker.dbSettings.GetDBConnection()
			connection.Find(&allWorkers)
			return c.JSON(http.StatusOK, &allWorkers)
		}
	})
}

func (worker *workers) AddWorker() {
	worker.echo.POST(WorkerEndPoint, func(c echo.Context) error {
		newWorker := new(models.Worker)
		if err := c.Bind(newWorker); err != nil {
			return err
		}
		log.Printf("Worker saved with %s", newWorker.FirstName)

		connection := worker.dbSettings.GetDBConnection()
		save := connection.Save(newWorker)

		if save.RowsAffected == 1 {
			allWorkers = append(allWorkers, newWorker)
			return c.JSON(http.StatusCreated, allWorkers)
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

		connection := worker.dbSettings.GetDBConnection()
		update := connection.Model(models.Worker{}).Where("id = ?", updateWorker.ID).Update(updateWorker)

		if update.RowsAffected == 1 {
			allWorkers = append(allWorkers, updateWorker)
			return c.JSON(http.StatusAccepted, allWorkers)
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update worker")
		}
	})
}

func (worker *workers) DeleteWorker() {
	worker.echo.DELETE(WorkerEndPoint, func(c echo.Context) error {
		deleteWorker := new(models.Worker)
		if err := c.Bind(deleteWorker); err != nil {
			return err
		}
		log.Printf("Worker deleted with %s", deleteWorker.FirstName)

		connection := worker.dbSettings.GetDBConnection()
		update := connection.Model(models.Worker{}).Delete(deleteWorker)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, allWorkers)
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update worker")
		}
	})
}
