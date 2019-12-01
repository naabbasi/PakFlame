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
	InventoryEndPoint = "/api/inventories"
)

func init() {
	log.Print("Inventory REST API initialized")
}

type inventories struct {
	echo       *echo.Echo
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewInventory(e *echo.Echo) *inventories {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &inventories{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (inventory *inventories) GetItems() {
	inventory.echo.GET(InventoryEndPoint, func(c echo.Context) error {
		var inventories []models.Inventory
		connection := inventory.dbSettings.GetDBConnection()
		connection.Find(&inventories)
		return c.JSON(http.StatusOK, &inventories)
	})
}

func (inventory *inventories) AddItem() {
	inventory.echo.POST(InventoryEndPoint, func(c echo.Context) error {
		newItem := new(models.Inventory)
		if err := c.Bind(newItem); err != nil {
			return err
		}
		log.Printf("Item saved with %s", newItem)

		connection := inventory.dbSettings.GetDBConnection()
		save := connection.Save(newItem)

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, newItem)
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to save new item in inventory")
		}
	})
}

func (inventory *inventories) UpdateItem() {
	inventory.echo.PUT(InventoryEndPoint, func(c echo.Context) error {
		updateItem := new(models.Inventory)
		if err := c.Bind(updateItem); err != nil {
			return err
		}
		log.Printf("Item saved with %s", updateItem)

		connection := inventory.dbSettings.GetDBConnection()
		update := connection.Model(models.Inventory{}).Where("id = ?", updateItem.ID).Update(updateItem)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, updateItem)
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update inventory")
		}
	})
}

func (inventory *inventories) DeleteItem() {
	inventory.echo.DELETE(InventoryEndPoint, func(c echo.Context) error {
		deleteItem := new(models.Inventory)
		if err := c.Bind(deleteItem); err != nil {
			return err
		}
		log.Printf("Item deleted with %s", deleteItem.ItemName)

		connection := inventory.dbSettings.GetDBConnection()
		update := connection.Model(models.Inventory{}).Delete(deleteItem)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, deleteItem)
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete item from inventory")
		}
	})
}
