package main

import (
	"flag"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/labstack/gommon/log"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/schema"
	"github.com/sanitary/config"
	"github.com/sanitary/rest/api"
	"github.com/sanitary/util/generator"

	"net/http"
	"os"
	"strings"
)

func main() {
	hostname, err := os.Hostname()
	if err == nil {
		log.Print("Server started on: http://" + strings.ToLower(hostname))
		e := echo.New()
		e.HideBanner = true
		e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
			AllowOrigins: []string{"http://" + strings.ToLower(hostname) + ":3000", "http://localhost:3000"},
			AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept,
				echo.HeaderAccessControlAllowCredentials, "X-Client-ID", echo.HeaderAuthorization},
			AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.OPTIONS},
			AllowCredentials: true,
			ExposeHeaders:    []string{echo.HeaderContentDisposition},
		}))

		//e.Use(middleware.Logger())
		e.Use(middleware.Recover())

		appConfig := config.NewConfig()
		if appConfig.DemoData == false {
			runMigration := flag.Bool("migration", false, "To run migration")
			dropSchema := flag.Bool("drop", false, "To drop schema")
			dropMigrationSchema := flag.Bool("drop-migration", false, "To drop schema and migrate schema")
			dropMigrationWithData := flag.Bool("drop-migration-data", false, "To drop schema and migrate schema along with data")
			data := flag.Bool("data", false, "To generate sample data")
			flag.Parse()

			if *runMigration {
				db := backend.GetDBSettings(appConfig)
				connection := db.GetDBConnection()
				connection.Exec("DROP SEQUENCE invoice_seq")
				connection.Exec("CREATE SEQUENCE invoice_seq")
				schema.CreatePostgreSQLSchema(connection)
			} else if *dropSchema {
				db := backend.GetDBSettings(appConfig)
				connection := db.GetDBConnection()
				connection.Exec("DROP SEQUENCE invoice_seq")
				schema.DropSchema(connection)
			} else if *dropMigrationSchema {
				db := backend.GetDBSettings(appConfig)
				connection := db.GetDBConnection()

				schema.DropSchema(connection)
				connection.Exec("DROP SEQUENCE invoice_seq")
				connection.Exec("CREATE SEQUENCE invoice_seq")
				schema.CreatePostgreSQLSchema(connection)
			} else if *dropMigrationWithData {
				db := backend.GetDBSettings(appConfig)
				connection := db.GetDBConnection()

				schema.DropSchema(connection)
				connection.Exec("DROP SEQUENCE invoice_seq")
				connection.Exec("CREATE SEQUENCE invoice_seq")
				schema.CreatePostgreSQLSchema(connection)

				data := generator.New()
				data.Import(connection)
			} else if *data {
				db := backend.GetDBSettings(appConfig)
				connection := db.GetDBConnection()

				data := generator.New()
				data.Import(connection)
			}
		}

		users := api.NewUser(e)
		users.GetUsers()
		users.AddUser()
		users.UpdateUser()
		users.DeleteUser()
		users.Login()

		restrictedPath := e.Group("/restricted")
		restrictedPath.Use(middleware.JWT([]byte(config.JWT_SECRET)))

		customers := api.NewCustomer(restrictedPath)
		customers.GetCustomers()
		customers.GetCustomerById()
		customers.AddCustomer()
		customers.UpdateCustomer()
		customers.DeleteCustomer()

		workers := api.NewWorker(restrictedPath)
		workers.Get()
		workers.GetWorkerById()
		workers.AddWorker()
		workers.UpdateWorker()
		workers.DeleteWorker()

		payment := api.NewPayment(restrictedPath)
		payment.GetPaymentsById()
		payment.AddPayment()
		payment.UpdatePayment()
		payment.DeletePayment()

		companies := api.NewCompany(restrictedPath)
		companies.GetCompanies()
		companies.AddCompany()
		companies.UpdateCompany()
		companies.DeleteCompany()
		companies.GetCompanyById()

		warehouse := api.NewWarehouse(restrictedPath)
		warehouse.GetWarehouses()
		warehouse.GetWarehouseById()
		warehouse.AddWarehouse()
		warehouse.UpdateWarehouse()
		warehouse.DeleteWarehouse()

		inventories := api.NewInventory(restrictedPath)
		inventories.GetItems()
		inventories.AddItem()
		inventories.UpdateItem()
		inventories.DeleteItem()

		invoices := api.NewInvoice(restrictedPath)
		invoices.GetInvoices()
		invoices.GetInvoiceById()
		invoices.AddInvoice()
		invoices.UpdateInvoice()
		invoices.DeleteInvoice()

		invoices.GetInvoiceDetailsById()
		invoices.AddInvoiceDetails()
		invoices.UpdateInvoiceDetail()
		invoices.DeleteInvoiceDetail()
		invoices.PrintInvoice()

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
