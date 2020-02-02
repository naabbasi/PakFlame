package api

import (
	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/models"
	"github.com/sanitary/config"
	"net/http"
)

const (
	WarehouseEndPoint = "/api/warehouses"
)

func init() {
	log.Print("Warehouse  REST API initialized")
}

type warehouses struct {
	echo       *echo.Echo
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewWarehouse(e *echo.Echo) *warehouses {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &warehouses{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (warehouse *warehouses) GetWarehouses() {
	warehouse.echo.GET(WarehouseEndPoint, func(c echo.Context) error {
		var allWarehouses = new([]models.Warehouse)
		connection := warehouse.dbSettings.GetDBConnection()
		connection.Find(&allWarehouses)
		return c.JSON(http.StatusOK, allWarehouses)
	})
}

func (warehouse *warehouses) AddWarehouse() {
	warehouse.echo.POST(WarehouseEndPoint, func(c echo.Context) error {
		newwarehouse := new(models.Warehouse)
		if err := c.Bind(newwarehouse); err != nil {
			return err
		}
		log.Printf("warehouse saved with %s", newwarehouse)

		connection := warehouse.dbSettings.GetDBConnection()
		save := connection.Save(newwarehouse)

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, "warehouse has been added")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to save new warehouse")
		}
	})
}

func (warehouse *warehouses) UpdateWarehouse() {
	warehouse.echo.PUT(WarehouseEndPoint, func(c echo.Context) error {
		updatewarehouse := new(models.Warehouse)
		if err := c.Bind(updatewarehouse); err != nil {
			return err
		}
		log.Printf("warehouse saved with %s", updatewarehouse)

		connection := warehouse.dbSettings.GetDBConnection()
		update := connection.Model(models.Warehouse{}).Where("id = ?", updatewarehouse.ID).Update(updatewarehouse)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "warehouse has been updated")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update warehouse")
		}
	})
}

func (warehouse *warehouses) Deletewarehouse() {
	warehouse.echo.DELETE(WarehouseEndPoint, func(c echo.Context) error {
		deletewarehouse := new(models.Warehouse)
		if err := c.Bind(deletewarehouse); err != nil {
			return err
		}
		log.Printf("warehouse deleted with %s", deletewarehouse)

		connection := warehouse.dbSettings.GetDBConnection()
		update := connection.Model(models.Warehouse{}).Delete(deletewarehouse)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "warehouse has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update worker")
		}
	})
}

func (warehouse *warehouses) GetWarehouseById() {
	warehouse.echo.GET(WarehouseEndPoint+"/:warehouseId", func(c echo.Context) error {
		warehouseId := c.Param("warehouseId")
		var allWarehouses = new(models.Warehouse)
		connection := warehouse.dbSettings.GetDBConnection()
		connection.First(&allWarehouses, "id = ?", &warehouseId)
		return c.JSON(http.StatusOK, allWarehouses)
	})
}
