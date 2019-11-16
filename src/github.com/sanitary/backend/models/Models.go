package models

import (
	"fmt"
	"time"
)

type Model struct {
	ID        string    `gorm:"PRIMARY_KEY; type:uuid default gen_random_uuid();" json:"id" xml:"id" form:"id" query:"id"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"createdAt" xml:"createdAt" form:"createdAt" query:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" xml:"updatedAt" form:"updatedAt" query:"updatedAt"`
}

type ModelSoftDelete struct {
	ID        int64      `gorm:"PRIMARY_KEY;AUTO_INCREMENT" json:"id" xml:"id" form:"id" query:"id"`
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
	FirstName    string `json:"firstName" xml:"firstName" form:"firstName" query:"firstName"`
	LastName     string `json:"lastName" xml:"lastName" form:"lastName" query:"lastName"`
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

type Inventory struct {
	Model
	ItemName      string  `json:"itemName" xml:"itemName" form:"itemName" query:"itemName"`
	Quantities    uint64  `json:"quantities" xml:"quantities" form:"quantities" query:"quantities"`
	QuantityAlert uint64  `json:"quantityAlert" xml:"quantityAlert" form:"quantityAlert" query:"quantityAlert"`
	PurchaseRate  float64 `json:"purchaseRate" xml:"purchaseRate" form:"purchaseRate" query:"purchaseRate"`
	WholesaleRate float64 `json:"wholesaleRate" xml:"wholesaleRate" form:"wholesaleRate" query:"wholesaleRate"`
	RetailRate    float64 `json:"retailRate" xml:"retailRate" form:"retailRate" query:"retailRate"`
	ItemStatus    string  `json:"itemStatus" xml:"itemStatus" form:"itemStatus" query:"itemStatus"`
	CompanyId     string  `gorm:"ForeignKey:companyId", json:"companyId" xml:"companyId" form:"companyId" query:"companyId"`
}

func (inventory Inventory) ToString() string {
	return fmt.Sprintf("id: %d\nname: %s\nprice: %0.1f\nquantity: %d\ncreated: %s", inventory.ID, inventory.ItemName, inventory.PurchaseRate, inventory.Quantities, inventory.CreatedAt.Format("02/01/2006"))
}

type Company struct {
	Model
	CompanyName  string      `json:"companyName" xml:"companyName" form:"companyName" query:"companyName"`
	MobileNumber string      `json:"mobileNumber" xml:"mobileNumber" form:"mobileNumber" query:"mobileNumber"`
	Inventory    []Inventory `json:"inventories" xml:"inventories" form:"inventories" query:"inventories"`
}
