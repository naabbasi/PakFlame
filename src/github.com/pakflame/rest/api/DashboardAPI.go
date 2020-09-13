package api

import (
	"github.com/labstack/echo"
	"github.com/pakflame/backend"
	"github.com/pakflame/backend/models"
	"github.com/pakflame/config"
	"github.com/pakflame/util/http_util"
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

func (dashboard *dashboard) TopEntities() {
	dashboard.echo.GET(DashboardEndPoint+"/entity/:entityName", func(c echo.Context) error {
		connection := dashboard.dbSettings.GetDBConnection()

		if c.Param("entityName") == "warehouses" {
			totalWarehouses := new(int64)
			connection.Model(&models.Warehouse{}).Where("client_id = ? ", http_util.GetUserInfo(c).ClientId).
				Count(totalWarehouses)

			return c.JSON(http.StatusOK, totalWarehouses)
		} else if c.Param("entityName") == "companies" {
			totalCompanies := new(int64)
			connection.Model(&models.Company{}).Where("client_id = ? ", http_util.GetUserInfo(c).ClientId).
				Count(totalCompanies)

			return c.JSON(http.StatusOK, totalCompanies)
		} else if c.Param("entityName") == "customers" {
			totalCompanies := new(int64)
			connection.Model(&models.Customer{}).Where("client_id = ? ", http_util.GetUserInfo(c).ClientId).
				Count(totalCompanies)

			return c.JSON(http.StatusOK, totalCompanies)
		} else if c.Param("entityName") == "workers" {
			totalCompanies := new(int64)
			connection.Model(&models.Worker{}).Where("client_id = ? ", http_util.GetUserInfo(c).ClientId).
				Count(totalCompanies)

			return c.JSON(http.StatusOK, totalCompanies)
		}

		return c.JSON(http.StatusBadRequest, "Please provide correct entity name")
	})
}

func (dashboard *dashboard) QuantityAlter() {
	dashboard.echo.GET(DashboardEndPoint+"/quantityAlert", func(c echo.Context) error {
		var quantityAlert = new([]models.Inventory)
		connection := dashboard.dbSettings.GetDBConnection()

		connection.Where("quantities <= quantity_alert AND client_id = ? ", http_util.GetUserInfo(c).ClientId).
			Order("item_name ASC").
			Find(&quantityAlert)

		if len(*quantityAlert) == 0 {
			return c.JSON(http.StatusNotFound, "No data found")
		} else {
			return c.JSON(http.StatusOK, quantityAlert)
		}
	})
}
