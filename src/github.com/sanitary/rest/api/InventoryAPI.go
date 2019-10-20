package api

import (
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo"
	"github.com/labstack/gommon/log"
	"github.com/sanitary/backend/models"
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
	db   *gorm.DB
	echo *echo.Echo
}

var allInventories []*models.Inventory

func NewInventory(e *echo.Echo) *inventories {
	return &inventories{echo: e}
}

func (inventory *inventories) GetItems() {
	inventory.echo.GET(InventoryEndPoint, func(c echo.Context) error {
		currentTime := time.Now()
		log.Print(currentTime.Format("October 20, 2019"))
		var inventory = []*models.Inventory{
			{
				Model: models.Model{
					ID:        1,
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				},
				ItemName:      "Sample Item 1",
				Quantities:    100,
				PurchaseRate:  500,
				WholesaleRate: 600,
				RetailRate:    700,
				ItemStatus:    "available",
				CompanyId:     1,
			},
			{
				Model: models.Model{
					ID:        2,
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				},
				ItemName:      "Sample Item 2",
				Quantities:    200,
				PurchaseRate:  5200,
				WholesaleRate: 5300,
				RetailRate:    5400,
				CompanyId:     2,
			},
			{
				Model: models.Model{
					ID:        3,
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				},
				ItemName:      "Sample Item 3",
				Quantities:    300,
				PurchaseRate:  401,
				WholesaleRate: 402,
				RetailRate:    403,
				CompanyId:     3,
			},
		}

		if len(allInventories) == 0 {
			allInventories = append(allInventories, inventory...)
		}

		return c.JSON(http.StatusOK, allInventories)
	})
}

func (inventory *inventories) AddItem() {
	inventory.echo.POST(InventoryEndPoint, func(c echo.Context) error {
		item := new(models.Inventory)
		if err := c.Bind(item); err != nil {
			return err
		}
		log.Printf("Item saved with %s", item)

		allInventories = append(allInventories, item)

		return c.JSON(http.StatusCreated, allInventories)
	})
}

func (inventory *inventories) UpdateItem() {
	inventory.echo.PUT(InventoryEndPoint, func(c echo.Context) error {
		item := new(models.Inventory)
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
		item := new(models.Inventory)
		if err := c.Bind(item); err != nil {
			return err
		}
		log.Printf("Item deleted with %s", item.ItemName)

		return c.JSON(http.StatusNoContent, item)
	})
}
