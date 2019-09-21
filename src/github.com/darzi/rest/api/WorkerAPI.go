package api

import (
	"github.com/darzi/backend/models"
	"github.com/labstack/echo"
	"log"
	"net/http"
)

const (
	WorkerEndPoint = "/api/workers"
)

type workers struct {
	echo *echo.Echo
}

func NewWorker(e *echo.Echo) workers {
	return workers{echo: e}
}

func (worker *workers) Get() {
	worker.echo.GET(WorkerEndPoint, func(c echo.Context) error {
		u := [...]models.Worker{
			{
				Status:  "working",
				Address: "H. NO 284, unit no 2 block d, Latifabad, Hyderabad",
				Person: models.Person{
					FirstName:    "Noman Ali",
					LastName:     "Abbasi",
					MobileNumber: "03012525461",
				},
			}, {
				Status:  "left",
				Address: "H. NO 284, unit no 2 block d, Latifabad, Hyderabad",
				Person: models.Person{
					FirstName:    "Farhan Ali",
					LastName:     "Abbasi",
					MobileNumber: "03012525461",
				},
			},
		}

		return c.JSON(http.StatusOK, u)
	})
}
func (worker *workers) AddWorker() {
	worker.echo.POST(WorkerEndPoint, func(c echo.Context) error {
		customer := new(models.Customer)
		if err := c.Bind(customer); err != nil {
			return err
		}
		log.Printf("Worker saved with %s", customer.FirstName)

		return c.JSON(http.StatusCreated, customer)
	})
}

func (worker *workers) DeleteWorker() {
	worker.echo.DELETE(WorkerEndPoint, func(c echo.Context) error {
		customer := new(models.Customer)
		if err := c.Bind(customer); err != nil {
			return err
		}
		log.Printf("Worker deleted with %s", customer.FirstName)

		return c.JSON(http.StatusOK, customer)
	})
}
