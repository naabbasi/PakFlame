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

type SysInfo struct {
	Model
	License   string `json:"license" xml:"license" form:"license" query:"license"`
	Migration bool   `json:"migration" xml:"migration" form:"migration" query:"migration"`
}

func (sysinfo SysInfo) ToString() string {
	return fmt.Sprintf("id: %s\nlicense: %s\nmigration: %v", sysinfo.ID, sysinfo.License, sysinfo.Migration)
}

type Client struct {
	ModelSoftDelete
	ClientName string `sql:"index" json:"clientName" xml:"clientName" form:"clientName" query:"clientName"`
}

func (client Client) ToString() string {
	return fmt.Sprintf("id: %s\nclient name: %s", client.ID, client.ClientName)
}

type ClientConfiguration struct {
	InvoiceFormat string    `json:"invoiceFormat" xml:"invoiceFormat" form:"invoiceFormat" query:"invoiceFormat"`
	ClientId      uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

type User struct {
	Model
	Username  string    `json:"userName" xml:"userName" form:"userName" query:"userName"`
	Password  string    `json:"password" xml:"password" form:"password" query:"password"`
	FirstName string    `json:"firstName" xml:"firstName" form:"firstName" query:"firstName"`
	LastName  string    `json:"lastName" xml:"lastName" form:"lastName" query:"lastName"`
	Token     string    `json:"token" xml:"token" form:"token" query:"token"`
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
	ShopName        string    `json:"shopName" xml:"shopName" form:"shopName" query:"shopName"`
	OrderStatus     string    `json:"orderStatus" xml:"orderStatus" form:"orderStatus" query:"orderStatus"`
	Address         string    `json:"address" xml:"address" form:"address" query:"address"`
	AdvanceAmount   float64   `gorm:"default: 0" json:"advanceAmount" xml:"advanceAmount" form:"advanceAmount" query:"advanceAmount"`
	RemainingAmount float64   `gorm:"default: 0" json:"remainingAmount" xml:"remainingAmount" form:"remainingAmount" query:"remainingAmount"`
	ClientId        uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

func (customer Customer) ToString() string {
	return fmt.Sprintf("id: %d\nfirst name: %s\nlast name: %s\norder status: %s", customer.ID, customer.FirstName, customer.LastName, customer.OrderStatus)
}

type Worker struct {
	Person
	Address         string    `json:"address" xml:"address" form:"address" query:"address"`
	AdvanceAmount   float64   `gorm:"default: 0" json:"advanceAmount" xml:"advanceAmount" form:"advanceAmount" query:"advanceAmount"`
	RemainingAmount float64   `gorm:"default: 0" json:"remainingAmount" xml:"remainingAmount" form:"remainingAmount" query:"remainingAmount"`
	WorkingStatus   string    `json:"workingStatus" xml:"workingStatus" form:"workingStatus" query:"workingStatus"`
	ClientId        uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

func (worker Worker) ToString() string {
	return fmt.Sprintf("id: %d\nfirst name: %s\nlast name: %s\norder status: %s", worker.ID, worker.FirstName, worker.LastName, worker.WorkingStatus)
}

type Payment struct {
	ID            uuid.UUID `gorm:"PRIMARY_KEY; type:uuid default gen_random_uuid();" json:"id" xml:"id" form:"id" query:"id"`
	Amount        float64   `json:"amount" xml:"amount" form:"amount" query:"amount"`
	InvoiceNumber int64     `json:"invoiceNumber" xml:"invoiceNumber" form:"invoiceNumber" query:"invoiceNumber"`
	Remaining     float64   `json:"remaining" xml:"remaining" form:"remaining" query:"remaining"`
	Total         float64   `json:"total" xml:"total" form:"total" query:"total"`
	CreatedAt     time.Time `json:"createdAt" xml:"createdAt" form:"createdAt" query:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt" xml:"updatedAt" form:"updatedAt" query:"updatedAt"`
	EntityId      uuid.UUID `json:"entityId" xml:"entityId" form:"entityId" query:"entityId"`
	ClientId      uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

func (payment Payment) ToString() string {
	return fmt.Sprintf("id: %d\nfirst name: %0.3f\nlast name: %0.3f\norder status: %0.3f", payment.ID, payment.Amount, payment.Remaining, payment.Total)
}

type Warehouse struct {
	Model
	Name         string    `json:"name" xml:"name" form:"name" query:"name"`
	Location     string    `json:"location" xml:"location" form:"location" query:"location"`
	Email        string    `json:"email" xml:"email" form:"email" query:"email"`
	MobileNumber string    `json:"mobileNumber" xml:"mobileNumber" form:"mobileNumber" query:"mobileNumber"`
	Status       string    `json:"status" xml:"status" form:"status" query:"status"`
	ClientId     uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

func (warehouse Warehouse) ToString() string {
	return fmt.Sprintf("id: %dname: %s\nlocation: %s\nemail: %s\nmobile number: %s", warehouse.ID, warehouse.Name, warehouse.Location, warehouse.Email, warehouse.MobileNumber)
}

type Company struct {
	Model
	CompanyName   string      `json:"companyName" xml:"companyName" form:"companyName" query:"companyName"`
	ContactPerson string      `json:"contactPerson" xml:"contactPerson" form:"contactPerson" query:"contactPerson"`
	MobileNumber  string      `json:"mobileNumber" xml:"mobileNumber" form:"mobileNumber" query:"mobileNumber"`
	Email         string      `json:"email" xml:"email" form:"email" query:"email"`
	Inventory     []Inventory `json:"inventories" xml:"inventories" form:"inventories" query:"inventories"`
	ClientId      uuid.UUID   `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

func (company Company) ToString() string {
	return fmt.Sprintf("id: %dcompany name: %s\nmobile number: %s\nemail: %s\nmobile number: %s", company.ID, company.CompanyName, company.MobileNumber, company.Email, company.MobileNumber)
}

type Inventory struct {
	Model
	ItemName      string    `json:"itemName" xml:"itemName" form:"itemName" query:"itemName"`
	Quantities    uint64    `gorm:"type: INT8 " json:"quantities" xml:"quantities" form:"quantities" query:"quantities"`
	QuantityAlert uint64    `json:"quantityAlert" xml:"quantityAlert" form:"quantityAlert" query:"quantityAlert"`
	PurchaseRate  float64   `json:"purchaseRate" xml:"purchaseRate" form:"purchaseRate" query:"purchaseRate"`
	WholesaleRate float64   `json:"wholesaleRate" xml:"wholesaleRate" form:"wholesaleRate" query:"wholesaleRate"`
	RetailRate    float64   `json:"retailRate" xml:"retailRate" form:"retailRate" query:"retailRate"`
	ItemStatus    string    `json:"itemStatus" xml:"itemStatus" form:"itemStatus" query:"itemStatus"`
	ItemTags      string    `json:"itemTags" xml:"itemTags" form:"itemTags" query:"itemTags"`
	CompanyId     uuid.UUID `gorm:"ForeignKey:company_id; type: uuid; NOT NULL" json:"companyId" xml:"companyId" form:"companyId" query:"companyId"`
	WarehouseId   uuid.UUID `gorm:"ForeignKey:warehouse_id; type: uuid; NOT NULL" json:"warehouse_id" xml:"warehouse_id" form:"warehouse_id" query:"warehouse_id"`
	ClientId      uuid.UUID `gorm:"ForeignKey:client_id; type: uuid; NOT NULL" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

func (inventory Inventory) ToString() string {
	return fmt.Sprintf("id: %d\nname: %s\nprice: %0.3f\nquantity: %d\ncreated: %s", inventory.ID, inventory.ItemName, inventory.PurchaseRate, inventory.Quantities, inventory.CreatedAt.Format("02/01/2006"))
}

type IssueInventory struct {
	Model
	ItemId     uuid.UUID `gorm:"ForeignKey:item_id; type: uuid; NOT NULL", json:"itemId" xml:"itemId" form:"itemId" query:"itemId"`
	ItemName   string    `json:"itemName" xml:"itemName" form:"itemName" query:"itemName"`
	Quantities uint64    `gorm:"type: INT8 " json:"quantities" xml:"quantities" form:"quantities" query:"quantities"`
	IssuerId   uuid.UUID `gorm:"ForeignKey:worker_id; type: uuid; NOT NULL" json:"issuerId" xml:"issuerId" form:"issuerId" query:"issuerId"`
	IssuerName string    `gorm:"-" json:"issuerName" xml:"issuerName" form:"issuerName" query:"issuerName"`
	WorkerId   uuid.UUID `gorm:"ForeignKey:worker_id; type: uuid; NOT NULL" json:"workerId" xml:"workerId" form:"workerId" query:"workerId"`
	WorkerName string    `gorm:"-" json:"workerName" xml:"workerName" form:"workerName" query:"workerName"`
	//CompanyId   uuid.UUID `gorm:"ForeignKey:company_id; type: uuid; NOT NULL" json:"companyId" xml:"companyId" form:"companyId" query:"companyId"`
	//WarehouseId uuid.UUID `gorm:"ForeignKey:warehouse_id; type: uuid; NOT NULL" json:"warehouseId" xml:"warehouseId" form:"warehouseId" query:"warehouseId"`
	ClientId uuid.UUID `gorm:"ForeignKey:client_id; type: uuid; NOT NULL" json:"clientId" xml:"clientId" form:"clientId" query:"clientId"`
}

type Product struct {
	Model
	ProductName       string    `json:"productName" xml:"productName" form:"productName" query:"productName"`
	ProductType       string    `json:"productType" xml:"productType" form:"productType" query:"productType"`
	ProductPrice      float64   `json:"productPrice" xml:"productPrice" form:"productPrice" query:"productPrice"`
	ProductDiscount   float64   `json:"productDiscount" xml:"productDiscount" form:"productDiscount" query:"productDiscount"`
	ProductModel      string    `json:"productModel" xml:"productModel" form:"productModel" query:"productModel"`
	ProductDate       time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"productDate" xml:"productDate" form:"productDate" query:"productDate"`
	ProductStatus     string    `json:"productStatus" xml:"productStatus" form:"productStatus" query:"productStatus"`
	ProductQuantities uint64    `json:"productQuantities" xml:"productQuantities" form:"productQuantities" query:"productQuantities"`
	ClientId          uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

type Invoice struct {
	ID                     int64            `gorm:"PRIMARY_KEY; type: integer default nextval('invoice_seq');" json:"id" xml:"id" form:"id" query:"id"`
	CreatedAt              time.Time        `json:"createdAt" xml:"createdAt" form:"createdAt" query:"createdAt"`
	UpdatedAt              time.Time        `json:"updatedAt" xml:"updatedAt" form:"updatedAt" query:"updatedAt"`
	CustomerName           string           `json:"customerName" xml:"customerName" form:"customerName" query:"customerName"`
	PartyName              string           `json:"partyName" xml:"partyName" form:"partyName" query:"partyName"`
	Address                string           `json:"address" xml:"address" form:"address" query:"address"`
	Transport              string           `json:"transport" xml:"transport" form:"transport" query:"transport"`
	TransportCharges       float64          `json:"transportCharges" xml:"transportCharges" form:"transportCharges" query:"transportCharges"`
	BillNumber             int64            `json:"billNumber" xml:"billNumber" form:"billNumber" query:"billNumber"`
	Readonly               bool             `gorm:"not null; default: false;" json:"readonly" xml:"readonly" form:"readonly" query:"readonly"`
	InvoiceDetails         []InvoiceDetails `json:"invoiceDetails" xml:"invoiceDetails" form:"invoiceDetails" query:"invoiceDetails"`
	InvoiceAmount          float64          `gorm:"invoiceAmount" json:"invoiceAmount" xml:"invoiceAmount" form:"invoiceAmount" query:"invoiceAmount"`
	InvoicePaidAmount      float64          `gorm:"invoicePaidAmount" json:"invoicePaidAmount" xml:"invoicePaidAmount" form:"invoicePaidAmount" query:"invoicePaidAmount"`
	InvoiceRemainingAmount float64          `gorm:"invoiceRemainingAmount" json:"invoiceRemainingAmount" xml:"invoicePaidAmount" form:"invoiceRemainingAmount" query:"invoiceRemainingAmount"`
	CustomerId             uuid.UUID        `gorm:"ForeignKey:customer_id; type: uuid;" json:"customerId" xml:"customerId" form:"customerId" query:"customerId"`
	ClientId               uuid.UUID        `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}

type InvoiceDetails struct {
	Model
	InvoiceNumber int64     `json:"invoiceNumber" xml:"invoiceNumber" form:"invoiceNumber" query:"invoiceNumber"`
	ItemId        uuid.UUID `gorm:"type: uuid;" json:"itemId" xml:"itemId" form:"itemId" query:"itemId"`
	ItemName      string    `json:"itemName" xml:"unit" form:"unit" query:"unit"`
	Unit          string    `json:"unit" xml:"unit" form:"unit" query:"unit"`
	Quantities    uint64    `json:"quantities" xml:"quantities" form:"quantities" query:"quantities"`
	Price         float64   `json:"price" xml:"price" form:"price" query:"price"`
	Amount        float64   `json:"amount" xml:"amount" form:"amount" query:"amount"`
	Discount      float64   `json:"discount" xml:"discount" form:"discount" query:"discount"`
	Readonly      bool      `gorm:"not null; default: false;" json:"readonly" xml:"readonly" form:"readonly" query:"readonly"`
	TotalAmount   float64   `json:"totalAmount" xml:"totalAmount" form:"totalAmount" query:"totalAmount"`
	ClientId      uuid.UUID `gorm:"ForeignKey:client_id; type: uuid;" json:"client_id" xml:"client_id" form:"client_id" query:"client_id"`
}
