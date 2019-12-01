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
	UserEndPoint = "/api/users"
)

func init() {
	log.Print("User REST API initialized")
}

type users struct {
	echo       *echo.Echo
	config     *config.Config
	dbSettings *backend.DBSettings
}

func NewUser(e *echo.Echo) *users {
	newConfig := config.NewConfig()
	dbSettings := backend.GetDBSettings(newConfig)
	return &users{config: newConfig, echo: e, dbSettings: dbSettings}
}

func (user *users) GetUsers() {
	user.echo.GET(UserEndPoint, func(c echo.Context) error {
		connection := user.dbSettings.GetDBConnection()
		allUsers := new(models.User)
		connection.Find(&allUsers)
		return c.JSON(http.StatusOK, allUsers)
	})
}

func (user *users) AddUser() {
	user.echo.POST(UserEndPoint, func(c echo.Context) error {
		newUser := new(models.User)
		if err := c.Bind(newUser); err != nil {
			return err
		}
		log.Printf("User saved with %s", &newUser)

		connection := user.dbSettings.GetDBConnection()
		save := connection.Save(&newUser)

		if save.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, "User has been added")
		} else {
			return c.JSON(http.StatusBadRequest, "User already exists")
		}
	})
}

func (user *users) UpdateUser() {
	user.echo.PUT(UserEndPoint, func(c echo.Context) error {
		updateUser := new(models.User)
		if err := c.Bind(updateUser); err != nil {
			return err
		}
		log.Printf("User saved with %s", updateUser)

		connection := user.dbSettings.GetDBConnection()
		update := connection.Model(models.User{}).Where("id = ?", updateUser.ID).Update(updateUser)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusCreated, "User has been updated")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to update user")
		}
	})
}

func (user *users) DeleteUser() {
	user.echo.DELETE(UserEndPoint, func(c echo.Context) error {
		deleteUser := new(models.User)
		if err := c.Bind(deleteUser); err != nil {
			return err
		}
		log.Printf("User deleted with %s", deleteUser)

		connection := user.dbSettings.GetDBConnection()
		update := connection.Model(models.User{}).Delete(deleteUser)

		if update.RowsAffected == 1 {
			return c.JSON(http.StatusNoContent, "User has been deleted")
		} else {
			return c.JSON(http.StatusInternalServerError, "Unable to delete user")
		}
	})
}

func (user *users) Login() {
	user.echo.POST(UserEndPoint+"/login", func(c echo.Context) error {
		getUser := new(models.User)
		if err := c.Bind(getUser); err != nil {
			return err
		}
		log.Printf("User login with %s", &getUser)

		connection := user.dbSettings.GetDBConnection()
		var loggedInUser models.User
		connection.First(&loggedInUser, "username = ? and password = ?", &getUser.Username, &getUser.Password)

		if loggedInUser.ID != "" {
			loggedInUser.Password = ""
			return c.JSON(http.StatusOK, loggedInUser)
		} else {
			return c.JSON(http.StatusUnauthorized, "Login failed")
		}
	})
}
