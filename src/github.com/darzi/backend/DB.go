package backend

import (
	"fmt"
	"github.com/darzi/config"
	"github.com/jinzhu/gorm"
	"github.com/labstack/gommon/log"
)

type db struct {
	Dialect string
	URL     string
}

func NewDB(config *config.Config) *db {
	var dialect string
	var url string

	if config.Database == "cockroach" {
		dialect = "postgres"
		url = fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", config.Username, config.Password, config.Host, config.Port, config.DatabaseName)
	} else if config.Database == "mysql" {
		dialect = "mysql"
		url = fmt.Sprintf("mysql://%s:%s@%s:%s/%s?sslmode=disable", config.Username, config.Password, config.Host, config.Port, config.DatabaseName)
	}

	return &db{Dialect: dialect, URL: url}
}

func (db *db) GetDBConnection() *gorm.DB {

	connection, err := gorm.Open(db.Dialect, db.URL)

	if err != nil {
		log.Errorf("Error occurred: ", err.Error())
	}

	return connection
}
