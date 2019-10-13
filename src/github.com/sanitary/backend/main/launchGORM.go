package main

import (
	"fmt"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/sanitary/backend"
	"github.com/sanitary/backend/models"
	"github.com/sanitary/backend/schema"
	"github.com/sanitary/config"
)

// import _ "github.com/jinzhu/gorm/dialects/mysql"
// import _ "github.com/jinzhu/gorm/dialects/postgres"
// import _ "github.com/jinzhu/gorm/dialects/sqlite"
// import _ "github.com/jinzhu/gorm/dialects/mssql"

func main() {
	//db, err := gorm.Open("postgres", "username=root host=127.0.0.1 port=")
	/*db, err := gorm.Open("mysql", "root:Password1@/sanitary?charset=utf8&parseTime=True&loc=Local")

	if err != nil {
		fmt.Println("Error: " + err.Error())
		fmt.Println("Not Working :(")
	}

	defer db.Close()*/

	newConfig := config.NewConfig()
	newDB := backend.NewDB(newConfig)
	db := newDB.GetDBConnection()
	defer db.Close()

	schema.CreatePostgreSQLSchema(db)

	db.Debug().Create(&models.User{Username: "\uFDF2", Password: "x"})

	customer := &models.Customer{}
	customer.FirstName = "Customer"
	customer.LastName = "Abbasi"
	customer.MobileNumber = "03012525461"
	customer.Status = "in_process"
	db.Create(&models.Customer{Person: customer.Person})

	worker := &models.Worker{}
	worker.FirstName = "Noman Ali"
	worker.LastName = "Abbasi"
	worker.MobileNumber = "03012525461"
	db.Create(&models.Worker{Person: worker.Person})

	// Read
	var user models.User
	db.First(&user, "username = ?", "nabbasi") // find user with username nabbasi
	fmt.Println(user)

	db.First(&user, "username = ? and password = ?", "nabbaasi", "x") // find user with username and password
	fmt.Println(user)

	// Update - update user's username
	update := db.Model(&user).Update("username", "nabbasi")
	fmt.Println(update.RowsAffected)

	// Delete - delete user
	//db.Delete(&user)
	schema.DropSchema(db)
}
