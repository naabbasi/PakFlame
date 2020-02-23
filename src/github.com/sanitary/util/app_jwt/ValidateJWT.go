package app_jwt

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
)

type UserInfo struct {
	Username string
	ClientId string
}

func GetUserInfo(c echo.Context) UserInfo {
	token := c.Get("user").(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	name := claims["name"].(string)
	clientId := claims["client_id"].(string)

	userInfo := UserInfo{Username: name, ClientId: clientId}
	return userInfo
}
