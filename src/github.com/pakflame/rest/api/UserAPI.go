package api

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"github.com/pakflame/backend"
	"github.com/pakflame/backend/models"
	"github.com/pakflame/config"
	"log"
	"net/http"
	"time"
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
		log.Printf("User saved with %v", &newUser)

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

		if loggedInUser.Username != "" {
			loggedInUser.Password = ""

			token := jwt.New(jwt.SigningMethodHS256)
			claims := token.Claims.(jwt.MapClaims)
			claims["name"] = loggedInUser.Username
			claims["client_id"] = loggedInUser.ClientId
			claims["admin"] = false
			claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

			encodedToken, err := token.SignedString([]byte(config.JWT_SECRET))
			log.Print(encodedToken)
			if err != nil {
				return err
			}

			loggedInUser.Token = encodedToken

			return c.JSON(http.StatusOK, loggedInUser)
		} else {
			return c.JSON(http.StatusUnauthorized, "Login failed")
		}
	})
}
