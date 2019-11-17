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
	InventoryEndPoint = "/api/inventories"
)

func init() {
	log.Print("Inventory initialized")
}

type inventories struct {
	echo       *echo.Echo
	config     *config.Config
	dbSettings *backend.DBSettings
}

var allInventories []*models.Inventory

func NewInventory(e *echo.Echo) *inventories {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &inventories{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (inventory *inventories) GetItems() {
	inventory.echo.GET(InventoryEndPoint, func(c echo.Context) error {
		if inventory.config.DemoData == true {
			var inventory = []*models.Inventory{
				{
					Model: models.Model{
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
					ItemName:      "Sample Item 1",
					Quantities:    100,
					PurchaseRate:  500,
					WholesaleRate: 600,
					RetailRate:    700,
					ItemStatus:    "available",
					CompanyId:     "",
				},
				{
					Model: models.Model{
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
					ItemName:      "Sample Item 2",
					Quantities:    200,
					PurchaseRate:  5200,
					WholesaleRate: 5300,
					RetailRate:    5400,
					CompanyId:     "",
				},
				{
					Model: models.Model{
						CreatedAt: time.Now(),
						UpdatedAt: time.Now(),
					},
					ItemName:      "Sample Item 3",
					Quantities:    300,
					PurchaseRate:  401,
					WholesaleRate: 402,
					RetailRate:    403,
					CompanyId:     "",
				},
			}

			if len(allInventories) == 0 {
				allInventories = append(allInventories, inventory...)
			}

			return c.JSON(http.StatusOK, allInventories)
		} else {
			connection := inventory.dbSettings.GetDBConnection()
			connection.Find(&allInventories)
			return c.JSON(http.StatusOK, &allInventories)
		}
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
			allInventories = append(allInventories, newItem)
			return c.JSON(http.StatusCreated, allInventories)
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
			allInventories = append(allInventories, updateItem)
			return c.JSON(http.StatusAccepted, allInventories)
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
			return c.JSON(http.StatusNoContent, allInventories)
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete item from inventory")
		}
	})
}
