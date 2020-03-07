package http_util

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
)

type UserInfo struct {
	Username string
	ClientId string
}

type CustomHttpResponse struct {
	Message string      `json:"message"`
	Result  interface{} `json:"result"`
}

func GetUserInfo(c echo.Context) UserInfo {
	token := c.Get("user").(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	name := claims["name"].(string)
	clientId := claims["client_id"].(string)

	userInfo := UserInfo{Username: name, ClientId: clientId}
	return userInfo
}
