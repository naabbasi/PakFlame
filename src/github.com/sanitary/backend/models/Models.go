package models

import (
	"fmt"
	"github.com/google/uuid"
	"time"
)

type Model struct {
	ID        uuid.UUID `gorm:"PRIMARY_KEY; type:uuid default gen_random_uuid();" json:"id" xml:"id" form:"id" query:"id"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"createdAt" xml:"createdAt" form:"createdAt" query:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" xml:"updatedAt" form:"updatedAt" query:"updatedAt"`
}

type ModelSoftDelete struct {
	ID        uuid.UUID  `gorm:"PRIMARY_KEY; type:uuid default gen_random_uuid();" json:"id" xml:"id" form:"id" query:"id"`
	CreatedAt time.Time  `json:"createdAt" xml:"createdAt" form:"createdAt" query:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt" xml:"updatedAt" form:"updatedAt" query:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt" xml:"deletedAt" form:"deletedAt" query:"deletedAt"` //Will help to perform deletion as soft
}

type ModelNoPK struct {
	CreatedAt time.Time `json:"createdAt" xml:"createdAt" form:"createdAt" query:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" xml:"updatedAt" form:"updatedAt" query:"updatedAt"`
}

type Client struct {
	ModelSoftDelete
	ClientName string `sql:"index" json:"clientName" xml:"clientName" form:"clientName" query:"clientName"`
}

type ClientConfiguration struct {
	ClientId uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

type User struct {
	Model
	Username  string    `json:"userName" xml:"userName" form:"userName" query:"userName"`
	Password  string    `json:"password" xml:"password" form:"password" query:"password"`
	FirstName string    `json:"firstName" xml:"firstName" form:"firstName" query:"firstName"`
	LastName  string    `json:"lastName" xml:"lastName" form:"lastName" query:"lastName"`
	ClientId  uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

type Person struct {
	Model
	FirstName    string `json:"firstName" xml:"firstName" form:"firstName" query:"firstName"`
	LastName     string `json:"lastName" xml:"lastName" form:"lastName" query:"lastName"`
	MobileNumber string `json:"mobileNumber" xml:"mobileNumber" form:"mobileNumber" query:"mobileNumber"`
}

type Customer struct {
	Person
	ShopName string    `json:"shopName" xml:"shopName" form:"shopName" query:"shopName"`
	Status   string    `json:"status" xml:"status" form:"status" query:"status"`
	Address  string    `json:"address" xml:"address" form:"address" query:"address"`
	ClientId uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

type Worker struct {
	Person
	Address  string    `json:"address" xml:"address" form:"address" query:"address"`
	Status   string    `json:"status" xml:"status" form:"status" query:"status"`
	ClientId uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

type Payment struct {
	Amount    float64   `json:"amount" xml:"amount" form:"amount" query:"amount"`
	Remaining float64   `json:"remaining" xml:"remaining" form:"remaining" query:"remaining"`
	Total     float64   `json:"total" xml:"total" form:"total" query:"total"`
	CreatedAt time.Time `json:"createdAt" xml:"createdAt" form:"createdAt" query:"createdAt"`
	EntityId  uuid.UUID `json:"entityId" xml:"entityId" form:"entityId" query:"entityId"`
}

type Warehouse struct {
	Model
	Name     string    `json:"name" xml:"name" form:"name" query:"name"`
	Location bool      `json:"location" xml:"location" form:"location" query:"location"`
	ClientId uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

type Inventory struct {
	Model
	CustomerId    uuid.UUID `gorm:"ForeignKey:customer_id; type: uuid;" json:"customerId" xml:"customerId" form:"customerId" query:"customerId"`
	CustomerName  string    `json:"customerName" xml:"customerName" form:"customerName" query:"customerName"`
	ItemName      string    `json:"itemName" xml:"itemName" form:"itemName" query:"itemName"`
	Quantities    uint64    `json:"quantities" xml:"quantities" form:"quantities" query:"quantities"`
	QuantityAlert uint64    `json:"quantityAlert" xml:"quantityAlert" form:"quantityAlert" query:"quantityAlert"`
	PurchaseRate  float64   `json:"purchaseRate" xml:"purchaseRate" form:"purchaseRate" query:"purchaseRate"`
	WholesaleRate float64   `json:"wholesaleRate" xml:"wholesaleRate" form:"wholesaleRate" query:"wholesaleRate"`
	RetailRate    float64   `json:"retailRate" xml:"retailRate" form:"retailRate" query:"retailRate"`
	ItemStatus    string    `json:"itemStatus" xml:"itemStatus" form:"itemStatus" query:"itemStatus"`
	CompanyId     uuid.UUID `gorm:"ForeignKey:company_id; type: uuid;" json:"companyId" xml:"companyId" form:"companyId" query:"companyId"`
	WarehouseId   uuid.UUID `gorm:"ForeignKey:warehouse_id; type: uuid;" json:"warehouse_id" xml:"warehouse_id" form:"warehouse_id" query:"warehouse_id"`
	ClientId      uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

func (inventory Inventory) ToString() string {
	return fmt.Sprintf("id: %d\nname: %s\nprice: %0.1f\nquantity: %d\ncreated: %s", inventory.ID, inventory.ItemName, inventory.PurchaseRate, inventory.Quantities, inventory.CreatedAt.Format("02/01/2006"))
}

type Company struct {
	Model
	CompanyName  string      `json:"companyName" xml:"companyName" form:"companyName" query:"companyName"`
	MobileNumber string      `json:"mobileNumber" xml:"mobileNumber" form:"mobileNumber" query:"mobileNumber"`
	Inventory    []Inventory `json:"inventories" xml:"inventories" form:"inventories" query:"inventories"`
	ClientId     uuid.UUID   `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

type Invoice struct {
	ID               int64            `gorm:"PRIMARY_KEY; type: integer default nextval('invoice_seq');" json:"id" xml:"id" form:"id" query:"id"`
	CreatedAt        time.Time        `json:"createdAt" xml:"createdAt" form:"createdAt" query:"createdAt"`
	UpdatedAt        time.Time        `json:"updatedAt" xml:"updatedAt" form:"updatedAt" query:"updatedAt"`
	CustomerName     string           `json:"customerName" xml:"customerName" form:"customerName" query:"customerName"`
	PartyName        string           `json:"partyName" xml:"partyName" form:"partyName" query:"partyName"`
	Address          string           `json:"address" xml:"address" form:"address" query:"address"`
	Transport        string           `json:"transport" xml:"transport" form:"transport" query:"transport"`
	TransportCharges float64          `json:"transportCharges" xml:"transportCharges" form:"transportCharges" query:"transportCharges"`
	InvoiceDetails   []InvoiceDetails `json:"invoiceDetails" xml:"invoiceDetails" form:"invoiceDetails" query:"invoiceDetails"`
	CustomerId       uuid.UUID        `json:"customerId" xml:"customerId" form:"customerId" query:"customerId"`
	ClientId         uuid.UUID        `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

type InvoiceDetails struct {
	InvoiceNumber int64     `json:"invoiceNumber" xml:"invoiceNumber" form:"invoiceNumber" query:"invoiceNumber"`
	ItemName      string    `json:"itemName" xml:"unit" form:"unit" query:"unit"`
	Unit          string    `json:"unit" xml:"unit" form:"unit" query:"unit"`
	Quantities    uint64    `json:"quantities" xml:"quantities" form:"quantities" query:"quantities"`
	Price         float64   `json:"price" xml:"price" form:"price" query:"price"`
	Amount        float64   `json:"amount" xml:"amount" form:"amount" query:"amount"`
	Discount      float64   `json:"discount" xml:"discount" form:"discount" query:"discount"`
	TotalAmount   float64   `json:"totalAmount" xml:"totalAmount" form:"totalAmount" query:"totalAmount"`
	ClientId      uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

type SysInfo struct {
	Model
	License   string `json:"license" xml:"license" form:"license" query:"license"`
	Migration bool   `json:"migration" xml:"migration" form:"migration" query:"migration"`
}
