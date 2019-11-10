package api

import (
	"github.com/labstack/echo"
	"github.com/sanitary/backend/models"
	"log"
	"net/http"
)

const (
	WorkerEndPoint = "/api/workers"
)

var allWorkers []*models.Worker

type workers struct {
	echo *echo.Echo
}

func NewWorker(e *echo.Echo) workers {
	return workers{echo: e}
}

func (worker *workers) Get() {
	worker.echo.GET(WorkerEndPoint, func(c echo.Context) error {
		worker1 := []*models.Worker{
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			allWorkers = append(allWorkers, worker1...)
		}

		return c.JSON(http.StatusOK, allWorkers)
	})
}

func (worker *workers) AddWorker() {
	worker.echo.POST(WorkerEndPoint, func(c echo.Context) error {
		worker := new(models.Worker)
		if err := c.Bind(worker); err != nil {
			return err
		}
		log.Printf("Worker saved with %s", worker.FirstName)

		allWorkers = append(allWorkers, worker)
		return c.JSON(http.StatusCreated, allWorkers)
	})
}

func (worker *workers) UpdateWorker() {
	worker.echo.PUT(WorkerEndPoint, func(c echo.Context) error {
		worker := new(models.Worker)
		if err := c.Bind(worker); err != nil {
			return err
		}
		log.Printf("Worker saved with %s", worker.FirstName)

		allWorkers = append(allWorkers, worker)
		return c.JSON(http.StatusCreated, allWorkers)
	})
}

func (worker *workers) DeleteWorker() {
	worker.echo.DELETE(WorkerEndPoint, func(c echo.Context) error {
		customer := new(models.Customer)
		if err := c.Bind(customer); err != nil {
			return err
		}
		log.Printf("Worker deleted with %s", customer.FirstName)

		return c.JSON(http.StatusNoContent, customer)
	})
}
