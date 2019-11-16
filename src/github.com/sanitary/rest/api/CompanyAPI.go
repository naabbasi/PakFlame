package api

import (
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
	"github.com/sanitary/backend/models"
	"net/http"
	"time"
)

const (
	CompanyEndPoint = "/api/companies"
)

func init() {
	log.Print("Company initialized")
}

type companies struct {
	db   *gorm.DB
	echo *echo.Echo
}

var allCompanies []*models.Company

func NewCompany(e *echo.Echo) *companies {
	return &companies{echo: e}
}

func (company *companies) GetCompanies() {
	company.echo.GET(CompanyEndPoint, func(c echo.Context) error {
		companies := []*models.Company{
			{
				Model: models.Model{
					CreatedAt: time.Time{},
					UpdatedAt: time.Time{},
				},
				CompanyName:  "Comapany 1",
				MobileNumber: "1234556472",
				Inventory:    nil,
			},
			{
				Model: models.Model{
					CreatedAt: time.Time{},
					UpdatedAt: time.Time{},
				},
				CompanyName:  "Comapany 2",
				MobileNumber: "123455679",
				Inventory:    nil,
			},
			{
				Model: models.Model{
					CreatedAt: time.Time{},
					UpdatedAt: time.Time{},
				},
				CompanyName:  "Comapany 3",
				MobileNumber: "12345567",
				Inventory:    nil,
			},
		}

		if len(allCompanies) == 0 {
			allCompanies = append(allCompanies, companies...)
		}

		return c.JSON(http.StatusOK, allCompanies)
	})
}

func (company *companies) AddCompany() {
	company.echo.POST(CompanyEndPoint, func(c echo.Context) error {
		comp := new(models.Company)
		if err := c.Bind(comp); err != nil {
			return err
		}
		log.Printf("Company saved with %s", comp)

		allCompanies = append(allCompanies, comp)
		return c.JSON(http.StatusCreated, allCompanies)
	})
}

func (company *companies) UpdateCompany() {
	company.echo.PUT(CompanyEndPoint, func(c echo.Context) error {
		comp := new(models.Company)
		if err := c.Bind(comp); err != nil {
			return err
		}
		log.Printf("Company saved with %s", comp)

		allCompanies = append(allCompanies, comp)
		return c.JSON(http.StatusOK, allCompanies)
	})
}

func (company *companies) DeleteCompany() {
	company.echo.DELETE(CompanyEndPoint, func(c echo.Context) error {
		comp := new(models.Company)
		if err := c.Bind(comp); err != nil {
			return err
		}
		log.Printf("Company deleted with %s", comp)

		return c.JSON(http.StatusNoContent, comp)
	})
}
