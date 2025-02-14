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
	IssueInventoryEndPoint = "/api/issue_inventory"
)

func init() {
	log.Print("Issue Inventory REST API initialized")
}

type issueInventories struct {
	echo       *echo.Group
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewIssueInventory(e *echo.Group) *issueInventories {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &issueInventories{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (issueInventory *issueInventories) GetIssueInventories() {
	issueInventory.echo.GET(IssueInventoryEndPoint, func(c echo.Context) error {
		var allIssueInventories = new([]models.IssueInventory)
		connection := issueInventory.dbSettings.GetDBConnection()
		connection.Select("issue_inventories.*, concat(w1.first_name, ' ', w1.last_name) as issuer_name, concat(w2.first_name, ' ', w2.last_name) as worker_name").
			Joins("inner join workers w1 on issue_inventories.issuer_id = w1.id inner join workers w2 on issue_inventories.worker_id = w2.id").
			Where("issue_inventories.client_id = ? ", http_util.GetUserInfo(c).ClientId).
			Find(&allIssueInventories)

		return c.JSON(http.StatusOK, &allIssueInventories)
	})
}

func (issueInventory *issueInventories) GetIssueInventoryById() {
	issueInventory.echo.GET(IssueInventoryEndPoint+"/:issueInventoryId", func(c echo.Context) error {
		var findIssueInventory = new(models.IssueInventory)
		issueInventoryId := c.Param("issueInventoryId")
		connection := issueInventory.dbSettings.GetDBConnection()
		connection.Table("issue_inventories").Where("id = ? and client_id = ?", issueInventoryId, http_util.GetUserInfo(c).ClientId).
			First(&findIssueInventory)
		return c.JSON(http.StatusOK, &findIssueInventory)
	})
}

func (issueInventory *issueInventories) AddIssueInventory() {
	issueInventory.echo.POST(IssueInventoryEndPoint, func(c echo.Context) error {
		newIssueInventory := new(models.IssueInventory)
		if err := c.Bind(newIssueInventory); err != nil {
			return err
		}
		log.Printf("issueInventory saved with %v", newIssueInventory)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			newIssueInventory.ClientId = clientId
		}

		connection := issueInventory.dbSettings.GetDBConnection()
		connection.Begin()
		save := connection.Save(newIssueInventory)

		//Update inventory table to update quantities
		itemInInventory := new(models.Inventory)
		connection.Model(models.Inventory{}).Where("id = ?", newIssueInventory.ItemId).First(itemInInventory)
		remainingItemInInventory := itemInInventory.Quantities - newIssueInventory.Quantities
		itemInInventory.Quantities = remainingItemInInventory
		updateItemInInventory := connection.Exec("update inventories set quantities = ? where id = ?", itemInInventory.Quantities, itemInInventory.ID)

		if updateItemInInventory.Error == nil {
			log.Printf("Item quantity has been updated: %.d", updateItemInInventory.RowsAffected)
		} else {
			connection.Rollback()
			return c.JSON(http.StatusInternalServerError, "Unable to issue new Inventory")
		}

		if save.RowsAffected == 1 {
			connection.Commit()
			return c.JSON(http.StatusCreated, "Inventory has been issued")
		} else {
			connection.Rollback()
			return c.JSON(http.StatusInternalServerError, "Unable to issue new Inventory")
		}

	})
}

func (issueInventory *issueInventories) UpdateIssueInventory() {
	issueInventory.echo.PUT(IssueInventoryEndPoint, func(c echo.Context) error {
		updateIssueInventory := new(models.IssueInventory)
		if err := c.Bind(updateIssueInventory); err != nil {
			return err
		}

		log.Printf("issueInventory updated with %s", updateIssueInventory)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			updateIssueInventory.ClientId = clientId
		}

		connection := issueInventory.dbSettings.GetDBConnection()
		update := connection.Model(models.IssueInventory{}).Where("id = ? and client_id = ?", updateIssueInventory.ID, updateIssueInventory.ClientId).Update(updateIssueInventory)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "Issue Inventory has been updated")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update Issue Inventory")
		}
	})
}

func (issueInventory *issueInventories) DeleteIssueInventory() {
	issueInventory.echo.DELETE(IssueInventoryEndPoint+"/:issueInventoryId", func(c echo.Context) error {

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, fmt.Sprintf("Unable to parse client id: %s", clientId))
		}

		connection := issueInventory.dbSettings.GetDBConnection()
		delete := connection.Where("id = ? and client_id = ?", c.Param("issueInventoryId"), clientId).Delete(models.IssueInventory{})

		if delete.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "Issued Inventory has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete Issued Inventory")
		}
	})
}
