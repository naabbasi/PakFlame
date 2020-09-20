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
	CompanyEndPoint = "/api/companies"
)

func init() {
	log.Print("Company  REST API initialized")
}

type companies struct {
	echo       *echo.Group
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewCompany(e *echo.Group) *companies {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &companies{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (company *companies) GetCompanies() {
	company.echo.GET(CompanyEndPoint, func(c echo.Context) error {
		var allCompanies = new([]models.Company)
		connection := company.dbSettings.GetDBConnection()
		connection.
			Where("client_id = ? ", http_util.GetUserInfo(c).ClientId).
			Order("company_name ASC").
			Find(&allCompanies)
		return c.JSON(http.StatusOK, allCompanies)
	})
}

func (company *companies) GetCompanyById() {
	company.echo.GET(CompanyEndPoint+"/:id", func(c echo.Context) error {
		companyId := c.Param("id")
		var allCompanies = new(models.Company)
		connection := company.dbSettings.GetDBConnection()
		connection.
			Where("id = ? and client_id = ?", companyId, http_util.GetUserInfo(c).ClientId).
			First(&allCompanies)
		return c.JSON(http.StatusOK, allCompanies)
	})
}

func (company *companies) AddCompany() {
	company.echo.POST(CompanyEndPoint, func(c echo.Context) error {
		newCompany := new(models.Company)
		if err := c.Bind(newCompany); err != nil {
			return err
		}
		log.Printf("Company saved with %s", newCompany)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			newCompany.ClientId = clientId
		}

		connection := company.dbSettings.GetDBConnection()
		save := connection.Save(newCompany)

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, "Company has been added")
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

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			updateCompany.ClientId = clientId
		}

		connection := company.dbSettings.GetDBConnection()
		update := connection.Model(models.Company{}).Where("id = ?", updateCompany.ID).Update(updateCompany)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "Company has been updated")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update company")
		}
	})
}

func (company *companies) DeleteCompany() {
	company.echo.DELETE(CompanyEndPoint+"/:id", func(c echo.Context) error {
		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, fmt.Sprintf("Unable to parse client id: %s", clientId))
		}

		connection := company.dbSettings.GetDBConnection()
		delete := connection.Where("id = ? and client_id = ?", c.Param("id"), clientId).Delete(models.Company{})

		if delete.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "Company has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete company")
		}
	})
}
