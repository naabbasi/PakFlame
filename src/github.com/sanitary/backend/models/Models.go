package models

import "time"

type Model struct {
	ID        uint      `gorm:"primary_key;auto_increment" json:"id" xml:"id" form:"id" query:"id"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"createdAt" xml:"createdAt" form:"createdAt" query:"createdAt"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updatedAt" xml:"updatedAt" form:"updatedAt" query:"updatedAt"`
}

type ModelSoftDelete struct {
	ID        uint       `gorm:"primary_key" json:"id" xml:"id" form:"id" query:"id"`
	CreatedAt time.Time  `json:"createdAt" xml:"createdAt" form:"createdAt" query:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt" xml:"updatedAt" form:"updatedAt" query:"updatedAt"`
	DeletedAt *time.Time `sql:"index" json:"deletedAt" xml:"deletedAt" form:"deletedAt" query:"deletedAt"` //Will help to perform deletion as soft
}

type ModelNoPK struct {
	CreatedAt time.Time `json:"createdAt" xml:"createdAt" form:"createdAt" query:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" xml:"updatedAt" form:"updatedAt" query:"updatedAt"`
}

type User struct {
	Model
	Username string
	Password string
}

type Person struct {
	Model
	FirstName    string `json:"firstname" xml:"firstname" form:"firstname" query:"firstname"`
	LastName     string `json:"lastname" xml:"lastname" form:"lastname" query:"lastname"`
	MobileNumber string `json:"mobileNumber" xml:"mobileNumber" form:"mobileNumber" query:"mobileNumber"`
}

type Customer struct {
	Person
	Status string `json:"status" xml:"status" form:"status" query:"status"`
}

type Worker struct {
	Person
	Address string `json:"address" xml:"address" form:"address" query:"address"`
	Status  string `json:"status" xml:"status" form:"status" query:"status"`
}

type Payment struct {
	Model
	Amount    float64 `json:"amount" xml:"amount" form:"amount" query:"amount"`
	Remaining float64 `json:"remaining" xml:"remaining" form:"remaining" query:"remaining"`
	Total     float64 `json:"total" xml:"total" form:"total" query:"total"`
}

type Iventory struct {
	Model
	ItemName      string  `json:"item_name" xml:"item_name" form:"item_name" query:"item_name"`
	PurchaseRate  float64 `json:"purchase_rate" xml:"purchase_rate" form:"purchase_rate" query:"purchase_rate"`
	WholesaleRate float64 `json:"wholesale_rate" xml:"wholesale_rate" form:"wholesale_rate" query:"wholesale_rate"`
	RetailRate    float64 `json:"retail_rate" xml:"retail_rate" form:"retail_rate" query:"retail_rate"`
}
