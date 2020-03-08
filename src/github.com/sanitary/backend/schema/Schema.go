package schema

import (
	"github.com/jinzhu/gorm"
	"github.com/sanitary/backend/models"
)

var entities []interface{}

func init() {
	entities = []interface{}{
		&models.User{},
		&models.Customer{},
		&models.Worker{},
		&models.Company{},
		&models.Inventory{},
		&models.Invoice{},
		&models.InvoiceDetails{},
	}
}

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
	db.AutoMigrate(
		&models.Client{},
		&models.ClientConfiguration{},
		&models.Customer{},
		&models.Worker{},
		&models.Payment{},
		&models.Company{},
		&models.Warehouse{},
		&models.Inventory{},
		&models.Invoice{},
		&models.InvoiceDetails{},
		&models.User{})

	//db.Model(&models.Company{}).AddForeignKey("id","inventories(companyId)","RESTRICT","RESTRICT")

	db.Model(&models.User{}).AddUniqueIndex("idx_username", "username")
	db.Model(&models.Worker{}).AddUniqueIndex("idx_worker_mobile_number", "mobile_number")
	db.Model(&models.Customer{}).AddUniqueIndex("idx_customer_mobile_number", "mobile_number")

	//db.Model(&models.Inventory{}).RemoveForeignKey("company_id", "companies(id)")
	//db.Model(&models.Inventory{}).RemoveForeignKey("customer_id", "customers(id)")
	//db.Model(&models.Invoice{}).RemoveForeignKey("customer_id", "customers(id)")

	//db.Model(&models.Inventory{}).AddForeignKey("company_id", "companies(id)", "RESTRICT", "RESTRICT")
	//db.Model(&models.Invoice{}).AddForeignKey("customer_id", "customers(id)", "RESTRICT", "RESTRICT")
	//db.Model(&models.User{}).AddUniqueIndex("idx_username","username","password")
}

func DropSchema(db *gorm.DB) {
	// Drop the schema
	db.DropTableIfExists(
		&models.Client{},
		&models.ClientConfiguration{},
		&models.Customer{},
		&models.Worker{},
		&models.Payment{},
		&models.Warehouse{},
		&models.Inventory{},
		&models.Invoice{},
		&models.InvoiceDetails{},
		&models.Company{},
		&models.User{},
	)
}
