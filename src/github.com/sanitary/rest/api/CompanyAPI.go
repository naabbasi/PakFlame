package api

import (
	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/models"
	"github.com/sanitary/config"
	"net/http"
	"time"
)

const (
	CompanyEndPoint = "/api/companies"
)

func init() {
	log.Print("Company  REST API initialized")
}

type companies struct {
	echo       *echo.Echo
	config     *config.Config
	dbSettings *backend.DBSettings
}

var allCompanies []*models.Company

func NewCompany(e *echo.Echo) *companies {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &companies{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (company *companies) GetCompanies() {
	company.echo.GET(CompanyEndPoint, func(c echo.Context) error {
		if company.config.DemoData == true {
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
		} else {
			connection := company.dbSettings.GetDBConnection()
			connection.Find(&allCompanies)
			return c.JSON(http.StatusOK, allCompanies)
		}
	})
}

func (company *companies) AddCompany() {
	company.echo.POST(CompanyEndPoint, func(c echo.Context) error {
		newCompany := new(models.Company)
		if err := c.Bind(newCompany); err != nil {
			return err
		}
		log.Printf("Company saved with %s", newCompany)

		connection := company.dbSettings.GetDBConnection()
		save := connection.Save(newCompany)

		if save.RowsAffected == 1 {
			allCompanies = append(allCompanies, newCompany)
			return c.JSON(http.StatusCreated, allCompanies)
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to save new company")
		}
	})
}

func (company *companies) UpdateCompany() {
	company.echo.PUT(CompanyEndPoint, func(c echo.Context) error {
		updateCompany := new(models.Company)
		if err := c.Bind(updateCompany); err != nil {
			return err
		}
		log.Printf("Company saved with %s", updateCompany)

		connection := company.dbSettings.GetDBConnection()
		update := connection.Model(models.Company{}).Where("id = ?", updateCompany.ID).Update(updateCompany)

		if update.RowsAffected == 1 {
			allCompanies = append(allCompanies, updateCompany)
			return c.JSON(http.StatusAccepted, allCompanies)
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update company")
		}
	})
}

func (company *companies) DeleteCompany() {
	company.echo.DELETE(CompanyEndPoint, func(c echo.Context) error {
		deleteCompany := new(models.Company)
		if err := c.Bind(deleteCompany); err != nil {
			return err
		}
		log.Printf("Company deleted with %s", deleteCompany)

		connection := company.dbSettings.GetDBConnection()
		update := connection.Model(models.Company{}).Delete(deleteCompany)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, allCompanies)
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update worker")
		}
	})
}
