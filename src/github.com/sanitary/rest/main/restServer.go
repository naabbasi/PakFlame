package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/models"
	"github.com/sanitary/backend/schema"
	"github.com/sanitary/rest/api"
	"net/http"
	"strconv"

	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/sanitary/config"
)

type User struct {
	ID    int64  `json: "id"`
	Name  string `json:"name" xml:"name" form:"name" query:"name"`
	Email string `json:"email" xml:"email" form:"email" query:"email"`
}

func main() {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.OPTIONS},
		AllowCredentials: true,
		ExposeHeaders:    []string{echo.HeaderContentDisposition},
	}))

	config := config.NewConfig()
	db := backend.NewDB(config)
	schema.CreatePostgreSQLSchema(db.GetDBConnection())

	customers := api.NewCustomer(e)
	customers.GetCustomers()
	customers.AddCustomer()
	customers.DeleteCustomer()

	workers := api.NewWorker(e)
	workers.Get()
	workers.AddWorker()
	workers.DeleteWorker()

	inventories := api.NewInventory(e)
	inventories.GetItems()
	inventories.AddItem()
	inventories.DeleteItem()

	//e.POST("/api/users", saveUser)
	e.GET("/api/users/:id", getUser)
	e.PUT("/api/users/:id", updateUser)
	//e.DELETE("/api/users/:id", deleteUser)

	e.GET("/api/users", func(c echo.Context) error {
		u := new(models.Customer)
		u.FirstName = "Will be fetch from DB"
		u.LastName = "Will be fetch from DB"
		u.MobileNumber = "Will be fetch from DB"
		u.Status = "Will be fetch from DB"

		if err := c.Bind(u); err != nil {
			return err
		}
		return c.JSON(http.StatusOK, u)
		// or
		// return c.XML(http.StatusCreated, u)
	})

	e.POST("/api/users", func(c echo.Context) error {
		u := new(User)
		if err := c.Bind(u); err != nil {
			return err
		}
		return c.JSON(http.StatusCreated, u)
		// or
		// return c.XML(http.StatusCreated, u)
	})

	e.Static("/static", "app/static")
	e.Static("/", "app")

	e.Logger.Fatal(e.Start(":1323"))
}

// e.GET("/api/users/:id", getUser)
func getUser(c echo.Context) error {
	// User ID from path `users/:id`
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	//return c.String(http.StatusOK, id)
	return c.JSON(http.StatusCreated, &User{ID: id, Name: "Noman Ali Abbasi"})
}

// e.GET("/api/users/:id", updateUser)
func updateUser(c echo.Context) error {
	// User ID from path `users/:id`
	id := c.Param("id")
	return c.String(http.StatusOK, id)
}

//e.GET("/api/show", show)
func show(c echo.Context) error {
	// Get team and member from the query string
	team := c.QueryParam("team")
	member := c.QueryParam("member")
	return c.String(http.StatusOK, "team:"+team+", member:"+member)
}

// e.POST("/api/save", save)
func save(c echo.Context) error {
	// Get name and email
	name := c.FormValue("name")
	email := c.FormValue("email")
	return c.String(http.StatusOK, "name:"+name+", email:"+email)
}
