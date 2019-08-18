package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"time"
)

// import _ "github.com/jinzhu/gorm/dialects/mysql"
// import _ "github.com/jinzhu/gorm/dialects/postgres"
// import _ "github.com/jinzhu/gorm/dialects/sqlite"
// import _ "github.com/jinzhu/gorm/dialects/mssql"

type Model struct {
	ID        uint `gorm:"primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time
	//DeletedAt *time.Time `sql:"index"`	//Will help to perform deletion as soft
}

type ModelNoPK struct {
	CreatedAt time.Time
	UpdatedAt time.Time
	//DeletedAt *time.Time `sql:"index"`	//Will help to perform deletion as soft
}

type Product struct {
	Model
	Code  string
	Price uint
}

func main() {
	db, err := gorm.Open("mysql", "root:Password1@/darzi?charset=utf8&parseTime=True&loc=Local")

	if err != nil {
		fmt.Println("Not Working :(")
	}

	defer db.Close()

	// Migrate the schema
	db.AutoMigrate(&Product{})

	// Create
	db.Create(&Product{Code: "L12121", Price: 1000})
	db.Create(&Product{Code: "L12122", Price: 2000})
	db.Create(&Product{Code: "L12123", Price: 3000})
	db.Create(&Product{Code: "L12124", Price: 4000})

	// Read
	var product Product
	db.First(&product, 1) // find product with id 1
	fmt.Println(product)

	db.First(&product, "code = ? and price = ?", "L12122", 2000) // find product with code l1212
	fmt.Println(product)

	// Update - update product's price to 2000
	db.Model(&product).Update("Price", 2000)
	fmt.Println(product)

	// Delete - delete product
	db.Delete(&product)
}
