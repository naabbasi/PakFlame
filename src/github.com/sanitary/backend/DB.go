package backend

import (
	"fmt"
	"github.com/jinzhu/gorm"
	"github.com/labstack/gommon/log"
	"github.com/sanitary/config"
)

type DBSettings struct {
	dialect string
	url     string
	debug   bool
}

func GetDBSettings(config *config.Config) *DBSettings {
	var dialect string
	var url string

	if config.Database == "cockroach" {
		dialect = "postgres"
		url = fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", config.Username, config.Password, config.Host, config.Port, config.DatabaseName)
	} else if config.Database == "mysql" {
		dialect = "mysql"
		url = fmt.Sprintf("mysql://%s:%s@%s:%s/%s?sslmode=disable", config.Username, config.Password, config.Host, config.Port, config.DatabaseName)
	}

	return &DBSettings{dialect: dialect, url: url, debug: config.Debug}
}

func (db *DBSettings) GetDBConnection() *gorm.DB {

	connection, err := gorm.Open(db.dialect, db.url)

	if err != nil {
		log.Errorf("Error occurred: ", err.Error())
	}

	if db.debug {
		connection = connection.Debug()
	}

	return connection
}
