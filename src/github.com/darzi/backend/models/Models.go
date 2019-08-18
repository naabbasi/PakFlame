package models

import "time"

type Model struct {
	ID        uint `gorm:"primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

type ModelSoftDelete struct {
	ID        uint `gorm:"primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time `sql:"index"` //Will help to perform deletion as soft
}

type ModelNoPK struct {
	CreatedAt time.Time
	UpdatedAt time.Time
}

type User struct {
	Model
	Username string
	Password string
}

type Person struct {
	Model
	FirstName    string
	LastName     string
	MobileNumber string
}

type Customer struct {
	Person
	Status string
}

type Worker struct {
	Person
	Address string
}

type Payment struct {
}
