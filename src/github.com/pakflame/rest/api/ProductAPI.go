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
	ProductEndPoint = "/api/products"
)

func init() {
	log.Print("Products  REST API initialized")
}

type products struct {
	echo       *echo.Group
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewProduct(e *echo.Group) *products {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &products{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (product *products) GetProducts() {
	product.echo.GET(ProductEndPoint, func(c echo.Context) error {
		var allProducts = new([]models.Product)
		connection := product.dbSettings.GetDBConnection()
		connection.
			Where("client_id = ? ", http_util.GetUserInfo(c).ClientId).
			Order("product_name ASC").
			Find(&allProducts)
		return c.JSON(http.StatusOK, allProducts)
	})
}

func (product *products) GetProductsById() {
	product.echo.GET(ProductEndPoint+"/:id", func(c echo.Context) error {
		productId := c.Param("id")
		var allProducts = new(models.Product)
		connection := product.dbSettings.GetDBConnection()
		connection.
			Where("id = ? and client_id = ?", productId, http_util.GetUserInfo(c).ClientId).
			First(&allProducts)
		return c.JSON(http.StatusOK, allProducts)
	})
}

func (product *products) AddProducts() {
	product.echo.POST(ProductEndPoint, func(c echo.Context) error {
		newProduct := new(models.Product)
		if err := c.Bind(newProduct); err != nil {
			return err
		}
		log.Printf("Product saved with %s", newProduct)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			newProduct.ClientId = clientId
		}

		connection := product.dbSettings.GetDBConnection()
		save := connection.Save(newProduct)

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, "Product has been added")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to save new Product")
		}
	})
}

func (product *products) UpdateProduct() {
	product.echo.PUT(ProductEndPoint, func(c echo.Context) error {
		updateProduct := new(models.Product)
		if err := c.Bind(updateProduct); err != nil {
			return err
		}
		log.Printf("Product saved with %s", updateProduct)

		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err == nil {
			updateProduct.ClientId = clientId
		}

		connection := product.dbSettings.GetDBConnection()
		update := connection.Model(models.Product{}).Where("id = ?", updateProduct.ID).Update(updateProduct)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusAccepted, "Product has been updated")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update Product")
		}
	})
}

func (product *products) DeleteProduct() {
	product.echo.DELETE(ProductEndPoint+"/:id", func(c echo.Context) error {
		clientId, err := uuid.Parse(http_util.GetUserInfo(c).ClientId)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, fmt.Sprintf("Unable to parse client id: %s", clientId))
		}

		connection := product.dbSettings.GetDBConnection()
		delete := connection.Where("id = ? and client_id = ?", c.Param("id"), clientId).Delete(models.Product{})

		if delete.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "Product has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete Product")
		}
	})
}
