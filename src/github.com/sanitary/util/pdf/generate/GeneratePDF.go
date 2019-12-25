package generate

import (
	"fmt"
	"github.com/jung-kurt/gofpdf"
	"github.com/sanitary/backend/models"
)

type Result struct {
	models.Invoice
	models.InvoiceDetails
}

var (
	pdf = new(gofpdf.Fpdf)
)

func init() {
	pdf = gofpdf.New("P", "mm", "A5", "")
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
}

func Pdf(result *[]Result) {
	fmt.Println(result)
}
