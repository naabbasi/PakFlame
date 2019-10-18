package schema

import (
	"github.com/jinzhu/gorm"
	"github.com/sanitary/backend/models"
)

func CreateMySQLSchema(db *gorm.DB) {
	// Migrate the schema
	//db.Set("gorm:table_options", "ENGINE=InnoDB").CreateTable(models.User{}) //If already exists then will throw error
	db.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(models.User{}, models.Worker{}, models.Customer{})

	db.Model(&models.User{}).AddUniqueIndex("idx_username", "username")
	db.Model(&models.Worker{}).AddUniqueIndex("idx_mobile_number", "mobile_number")
	//db.Model(&models.User{}).AddUniqueIndex("idx_username","username","password")
}

func CreatePostgreSQLSchema(db *gorm.DB) {
	// Migrate the schema
	//db.Set("gorm:table_options", "ENGINE=InnoDB").CreateTable(models.User{}) //If already exists then will throw error
	db.AutoMigrate(models.User{}, models.Worker{}, models.Customer{})

	db.Model(&models.User{}).AddUniqueIndex("idx_username", "username")
	db.Model(&models.Worker{}).AddUniqueIndex("idx_worker_mobile_number", "mobile_number")
	db.Model(&models.Worker{}).AddUniqueIndex("idx_customer_mobile_number", "mobile_number")
	db.Model(&models.Iventory{})
	//db.Model(&models.User{}).AddUniqueIndex("idx_username","username","password")
}

func DropSchema(db *gorm.DB) {
	// Drop the schema
	db.DropTableIfExists(&models.User{}, &models.Customer{}, "workers")
}
