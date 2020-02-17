package api

import (
	"github.com/google/uuid"
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
		connection.Where("client_id = ?", c.Request().Header.Get(config.CLIENT_HEADER)).Find(&allWarehouses)
		return c.JSON(http.StatusOK, allWarehouses)
	})
}

func (warehouse *warehouses) GetWarehouseById() {
	warehouse.echo.GET(WarehouseEndPoint+"/:warehouseId", func(c echo.Context) error {
		warehouseId := c.Param("warehouseId")
		var allWarehouses = new(models.Warehouse)
		connection := warehouse.dbSettings.GetDBConnection()
		connection.First(&allWarehouses, "id = ? and client_id =?", &warehouseId, c.Request().Header.Get(config.CLIENT_HEADER))
		return c.JSON(http.StatusOK, allWarehouses)
	})
}

func (warehouse *warehouses) AddWarehouse() {
	warehouse.echo.POST(WarehouseEndPoint, func(c echo.Context) error {
		newWarehouse := new(models.Warehouse)
		if err := c.Bind(newWarehouse); err != nil {
			return err
		}
		log.Printf("warehouse saved with %s", newWarehouse)

		clientId, err := uuid.Parse(c.Request().Header.Get(config.CLIENT_HEADER))
		if err == nil {
			newWarehouse.ClientId = clientId
		}

		connection := warehouse.dbSettings.GetDBConnection()
		save := connection.Save(newWarehouse)

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, "warehouse has been added")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to save new warehouse")
		}
	})
}

func (warehouse *warehouses) UpdateWarehouse() {
	warehouse.echo.PUT(WarehouseEndPoint, func(c echo.Context) error {
		updateWarehouse := new(models.Warehouse)
		if err := c.Bind(updateWarehouse); err != nil {
			return err
		}
		log.Printf("warehouse saved with %s", updateWarehouse)

		clientId, err := uuid.Parse(c.Request().Header.Get(config.CLIENT_HEADER))
		if err == nil {
			updateWarehouse.ClientId = clientId
		}

		connection := warehouse.dbSettings.GetDBConnection()
		update := connection.Model(models.Warehouse{}).Where("id = ? and client_id = ?", updateWarehouse.ID, updateWarehouse.ClientId).Update(updateWarehouse)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "warehouse has been updated")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update warehouse")
		}
	})
}

func (warehouse *warehouses) DeleteWarehouse() {
	warehouse.echo.DELETE(WarehouseEndPoint, func(c echo.Context) error {
		deleteWarehouse := new(models.Warehouse)
		if err := c.Bind(deleteWarehouse); err != nil {
			return err
		}
		log.Printf("warehouse deleted with %s", deleteWarehouse)

		clientId, err := uuid.Parse(c.Request().Header.Get(config.CLIENT_HEADER))
		if err == nil {
			deleteWarehouse.ClientId = clientId
		}

		connection := warehouse.dbSettings.GetDBConnection()
		update := connection.Model(models.Warehouse{}).Where("id = ? and client_id = ?", deleteWarehouse.ID, deleteWarehouse.ClientId).Delete(deleteWarehouse)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "warehouse has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update worker")
		}
	})
}
