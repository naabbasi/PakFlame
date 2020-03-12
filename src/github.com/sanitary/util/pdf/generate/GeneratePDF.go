package generate

import (
	"fmt"
	"github.com/jung-kurt/gofpdf"
	"github.com/sanitary/backend/models"
	"runtime"
)

type Result struct {
	models.Invoice
	InvoiceDetails []models.InvoiceDetails
	models.Payment
}

var (
	align     = []string{"C", "L", "C", "R", "R", "R", "R", "R"}
	colsWidth = []float64{6, 30, 9, 10, 15, 20, 20, 20}
)

func Pdf(result *Result) {
	pdf := gofpdf.New("P", "mm", "A5", "")
	pdf.SetHeaderFunc(func() {
		pdf.SetFont("Arial", "B", 12)
		pdf.CellFormat(130, 5, "AbuZar Traders", "", 0, "C", false, 0, "")
		pdf.Ln(-1)

		pdf.SetFont("Arial", "", 8)
		pdf.CellFormat(130, 5, "Pathan colony, City gate, Hyderabad Mobile # 03012525461", "", 0, "C", false, 0, "")
		pdf.Ln(-1)

		pdf.SetFont("Arial", "B", 8)
		pdf.CellFormat(130, 7, "Sale Invoice", "", 0, "C", false, 0, "")
		pdf.Ln(-1)
	})

	invoiceId := generateHeader(result, pdf)
	generateTable(result, pdf)
	var path = "change_according_to_os"
	if runtime.GOOS == "windows" {
		path = "D:/"
	} else {
		path = "/opt/"
	}
	err := pdf.OutputFileAndClose(fmt.Sprintf("%sSaleInvoice-%d.pdf", path, invoiceId))

	if err != nil {
		fmt.Println(err.Error())
	}
}

func generateHeader(result *Result, pdf *gofpdf.Fpdf) int64 {
	invoice := models.Invoice{}

	invoice = models.Invoice{
		ID:               result.Invoice.ID,
		CustomerName:     result.Invoice.CustomerName,
		PartyName:        result.Invoice.PartyName,
		Transport:        result.Invoice.Transport,
		TransportCharges: result.Invoice.TransportCharges,
	}

	pdf.AddPage()
	pdf.SetFont("Arial", "", 8)
	pdf.CellFormat(65, 5, fmt.Sprintf("Invoice #: %d", invoice.ID), "1", 0, "L", false, 0, "")
	pdf.CellFormat(65, 5, fmt.Sprintf("Date: %s", invoice.CreatedAt.Format("01 December 2006")), "1", 0, "L", false, 0, "")
	pdf.Ln(-1)

	pdf.CellFormat(43.33, 5, fmt.Sprintf("Customer: %s", invoice.CustomerName), "1", 0, "L", false, 0, "")
	pdf.CellFormat(43.33, 5, fmt.Sprintf("Party: %s", invoice.PartyName), "1", 0, "L", false, 0, "")
	pdf.CellFormat(43.33, 5, fmt.Sprintf("Transport: %s, %.2f", invoice.Transport, invoice.TransportCharges), "1", 0, "L", false, 0, "")
	pdf.Ln(-1)
	pdf.CellFormat(130, 5, fmt.Sprintf("Address: %s", invoice.Address), "1", 0, "L", false, 0, "")
	pdf.Ln(6)

	return invoice.ID
}

func generateTable(result *Result, pdf *gofpdf.Fpdf) {
	headers := []string{"S #", "Item Description", "Unit", "Qty", "Price", "Amount", "Discount", "Total Amount"}

	pdf.SetFont("Arial", "B", 8)
	pdf.SetFillColor(240, 240, 240)
	for i, header := range headers {
		pdf.CellFormat(colsWidth[i], 5, header, "1", 0, "C", true, 0, "")
	}

	//Add new line after header
	pdf.Ln(0)
	pdf.SetFont("Arial", "", 8)
	pdf.SetFillColor(255, 255, 255)

	var totalQuantities uint64 = 0
	totalPrice := 0.0
	totalAmount := 0.0
	totalDiscount := 0.0
	totalDiscountedAmount := 0.0
	sumOfTotalAmount := 0.0
	transportCharges := 0.0

	itemSerial := 0

	for _, row := range result.InvoiceDetails {
		transportCharges = result.Invoice.TransportCharges
		invoiceDetails := models.InvoiceDetails{
			ItemName:    row.ItemName,
			Unit:        row.Unit,
			Quantities:  row.Quantities,
			Price:       row.Price,
			Amount:      row.Amount,
			Discount:    row.Discount,
			TotalAmount: 0.0,
		}

		quantities := invoiceDetails.Quantities
		totalQuantities += quantities

		price := invoiceDetails.Price
		totalPrice += price

		amount := float64(quantities) * price
		totalAmount += amount

		discountOnItem := invoiceDetails.Discount
		totalDiscount += discountOnItem

		discountedAmount := (discountOnItem / 100.0) * amount
		totalDiscountedAmount += discountOnItem

		totalAmount := amount - discountedAmount
		sumOfTotalAmount += totalAmount

		pdf.Ln(-1)
		pdf.SetFont("Arial", "", 8)
		pdf.SetFillColor(255, 255, 255)

		itemSerial = itemSerial + 1
		pdf.CellFormat(colsWidth[0], 5, fmt.Sprintf("%d", itemSerial), "1", 0, align[0], false, 0, "")
		pdf.CellFormat(colsWidth[1], 5, invoiceDetails.ItemName, "1", 0, align[1], false, 0, "")
		pdf.CellFormat(colsWidth[2], 5, invoiceDetails.Unit, "1", 0, align[2], false, 0, "")
		pdf.CellFormat(colsWidth[3], 5, fmt.Sprintf("%d", quantities), "1", 0, align[3], false, 0, "")
		pdf.CellFormat(colsWidth[4], 5, fmt.Sprintf("%.2f", price), "1", 0, align[4], false, 0, "")
		pdf.CellFormat(colsWidth[5], 5, fmt.Sprintf("%.2f", amount), "1", 0, align[5], false, 0, "")
		pdf.CellFormat(colsWidth[6], 5, fmt.Sprintf("%.0f", discountOnItem), "1", 0, align[6], false, 0, "")
		pdf.CellFormat(colsWidth[7], 5, fmt.Sprintf("%.2f", totalAmount), "1", 0, align[7], false, 0, "")
		pdf.Ln(0)
	}

	pdf.Ln(5)
	//Add grand total
	pdf.SetFooterFunc(func() {
		pdf.CellFormat(25, 5, "", "0", 0, "L", false, 0, "")
		pdf.CellFormat(20, 5, "Gross Amount", "1", 0, "L", false, 0, "")
		pdf.CellFormat(10, 5, fmt.Sprintf("%.d", totalQuantities), "1", 0, "R", false, 0, "")
		pdf.CellFormat(15, 5, fmt.Sprintf("%.2f", totalPrice), "1", 0, "R", false, 0, "")
		pdf.CellFormat(20, 5, fmt.Sprintf("%.2f", totalAmount), "1", 0, "R", false, 0, "")
		pdf.CellFormat(20, 5, fmt.Sprintf("%.0f", totalDiscount), "1", 0, "R", false, 0, "")
		pdf.CellFormat(20, 5, fmt.Sprintf("%.2f", sumOfTotalAmount+transportCharges), "1", 0, "R", false, 0, "")
	})

	result.Payment.Total = sumOfTotalAmount + transportCharges
}
