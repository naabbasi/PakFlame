package api

import (
	"github.com/labstack/echo"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/models"
	"github.com/sanitary/config"
	"github.com/sanitary/util/http_util"
	"log"
	"net/http"
)

const (
	DashboardEndPoint = "/api/dashboard"
)

func init() {
	log.Print("Company  REST API initialized")
}

type dashboard struct {
	echo       *echo.Group
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewDashboard(e *echo.Group) *dashboard {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &dashboard{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (dashboard *dashboard) TopTenItemsByQuantities() {
	dashboard.echo.GET(DashboardEndPoint+"/items/quantities/:order", func(c echo.Context) error {
		var topInventories = new([]models.Inventory)
		connection := dashboard.dbSettings.GetDBConnection()

		if c.Param("order") == "desc" {
			connection.Where("client_id = ? ", http_util.GetUserInfo(c).ClientId).
				Order("quantities DESC").
				Limit("10").
				Find(&topInventories)
		} else {
			connection.Where("client_id = ? ", http_util.GetUserInfo(c).ClientId).
				Order("quantities ASC").
				Limit("10").
				Find(&topInventories)
		}

		if len(*topInventories) == 0 {
			return c.JSON(http.StatusNotFound, "No data found")
		} else {
			return c.JSON(http.StatusOK, topInventories)
		}
	})
}

func (dashboard *dashboard) GetCompanyById() {
	dashboard.echo.GET(DashboardEndPoint+"/:companyId", func(c echo.Context) error {
		companyId := c.Param("companyId")
		var allCompanies = new(models.Company)
		connection := dashboard.dbSettings.GetDBConnection()
		connection.First(&allCompanies, "id = ?", &companyId)
		return c.JSON(http.StatusOK, allCompanies)
	})
}
