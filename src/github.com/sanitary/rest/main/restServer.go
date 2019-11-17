package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/labstack/gommon/log"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/schema"
	"github.com/sanitary/config"
	"github.com/sanitary/rest/api"

	"net/http"
	"os"
	"strconv"
	"strings"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type User struct {
	ID    int64  `json: "id"`
	Name  string `json:"name" xml:"name" form:"name" query:"name"`
	Email string `json:"email" xml:"email" form:"email" query:"email"`
}

func main() {
	hostname, err := os.Hostname()
	if err == nil {
		log.Print("Server started on: http://" + strings.ToLower(hostname))
		e := echo.New()
		e.HideBanner = true
		e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
			AllowOrigins:     []string{"http://" + strings.ToLower(hostname) + ":3000", "http://localhost:3000"},
			AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAccessControlAllowCredentials},
			AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.OPTIONS},
			AllowCredentials: true,
			ExposeHeaders:    []string{echo.HeaderContentDisposition},
		}))

		//e.Use(middleware.BasicAuth(middleware.BasicAuthConfig{}))

		config := config.NewConfig()
		if config.DemoData == false {
			db := backend.GetDBSettings(config)
			schema.CreatePostgreSQLSchema(db.GetDBConnection())
		}

		users := api.NewUser(e)
		users.GetUsers()
		users.AddUser()
		users.UpdateUser()
		users.DeleteUser()
		users.Login()

		customers := api.NewCustomer(e)
		customers.GetCustomers()
		customers.AddCustomer()
		customers.UpdateCustomer()
		customers.DeleteCustomer()

		workers := api.NewWorker(e)
		workers.Get()
		workers.AddWorker()
		workers.UpdateWorker()
		workers.DeleteWorker()

		companies := api.NewCompany(e)
		companies.GetCompanies()
		companies.AddCompany()
		companies.UpdateCompany()
		companies.DeleteCompany()

		inventories := api.NewInventory(e)
		inventories.GetItems()
		inventories.AddItem()
		inventories.UpdateItem()
		inventories.DeleteItem()

		e.Static("/static", "app/static")
		e.Static("/", "app")

		e.Logger.Fatal(e.Start(":80"))
	}

	//e.POST("/api/users", saveUser)
	//e.GET("/api/users/:id", getUser)
	//e.PUT("/api/users/:id", updateUser)
	//e.DELETE("/api/users/:id", deleteUser)

	/*e.GET("/api/users", func(c echo.Context) error {
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
	})*/
}

// e.GET("/api/users/:id", getUser)
/*func getUser(c echo.Context) error {
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
}*/

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

type (
	user struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	}
)

var (
	users = map[int]*user{}
	seq   = 1
)

//----------
// Handlers
//----------

func createUser(c echo.Context) error {
	u := &user{
		ID: seq,
	}
	if err := c.Bind(u); err != nil {
		return err
	}
	users[u.ID] = u
	seq++
	return c.JSON(http.StatusCreated, u)
}

func getUser(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	return c.JSON(http.StatusOK, users[id])
}

func updateUser(c echo.Context) error {
	u := new(user)
	if err := c.Bind(u); err != nil {
		return err
	}
	id, _ := strconv.Atoi(c.Param("id"))
	users[id].Name = u.Name
	return c.JSON(http.StatusOK, users[id])
}

func deleteUser(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	delete(users, id)
	return c.NoContent(http.StatusNoContent)
}
