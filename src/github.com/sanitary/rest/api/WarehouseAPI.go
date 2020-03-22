package api

import (
	"fmt"
	"github.com/google/uuid"
	"github.com/labstack/echo"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/models"
	"github.com/sanitary/config"
	"github.com/sanitary/util/http_util"
	"log"
	"net/http"
)

const (
	WarehouseEndPoint = "/api/warehouses"
)

func init() {
	log.Print("Warehouse  REST API initialized")
}

type warehouses struct {
	echo       *echo.Group
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewWarehouse(e *echo.Group) *warehouses {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &warehouses{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (warehouse *warehouses) GetWarehouses() {
	warehouse.echo.GET(WarehouseEndPoint, func(c echo.Context) error {
		var allWarehouses = new([]models.Warehouse)
		connection := warehouse.dbSettings.GetDBConnection()
		connection.Where("client_id = ?", http_util.GetUserInfo(c).ClientId).
			Order("name ASC").
			Find(&allWarehouses)
		return c.JSON(http.StatusOK, allWarehouses)
	})
}

func (warehouse *warehouses) GetWarehouseById() {
	warehouse.echo.GET(WarehouseEndPoint+"/:warehouseId", func(c echo.Context) error {
		warehouseId := c.Param("warehouseId")
		var allWarehouses = new(models.Warehouse)
		connection := warehouse.dbSettings.GetDBConnection()
		connection.First(&allWarehouses, "id = ? and client_id =?", &warehouseId, http_util.GetUserInfo(c).ClientId)
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

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
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

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
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
	warehouse.echo.DELETE(WarehouseEndPoint+"/:warehouseId", func(c echo.Context) error {
		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, fmt.Sprintf("Unable to parse client id: %s", clientId))
		}

		connection := warehouse.dbSettings.GetDBConnection()
		delete := connection.Where("id = ? and client_id = ?", c.Param("warehouseId"), clientId).Delete(models.Warehouse{})

		if delete.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "Company has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete company")
		}
	})
}
