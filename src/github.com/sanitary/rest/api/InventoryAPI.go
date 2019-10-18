package api

import (
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
	"github.com/sanitary/backend/models"
	"net/http"
)

const (
	InventoryEndPoint = "/api/inventories"
)

func init() {
	log.Print("Inventory initialized")
}

type inventories struct {
	db   *gorm.DB
	echo *echo.Echo
}

var allInventories []*models.Iventory

func NewInventory(e *echo.Echo) *inventories {
	return &inventories{echo: e}
}

func (inventory *inventories) GetItems() {
	inventory.echo.GET(InventoryEndPoint, func(c echo.Context) error {
		var inventory = [...]models.Iventory{
			{
				ItemName: "Sample Item",
			},
		}

		return c.JSON(http.StatusOK, inventory)
	})
}

func (inventory *inventories) AddItem() {
	inventory.echo.POST(InventoryEndPoint, func(c echo.Context) error {
		item := new(models.Iventory)
		if err := c.Bind(item); err != nil {
			return err
		}
		log.Printf("Item saved with %s", item)

		allInventories = append(allInventories, item)

		return c.JSON(http.StatusCreated, allInventories)
	})
}

func (inventory *inventories) DeleteItem() {
	inventory.echo.DELETE(InventoryEndPoint, func(c echo.Context) error {
		item := new(models.Iventory)
		if err := c.Bind(item); err != nil {
			return err
		}
		log.Printf("Item deleted with %s", item.ItemName)

		return c.JSON(http.StatusOK, item)
	})
}
