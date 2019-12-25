package main

import (
	"fmt"
	"github.com/jung-kurt/gofpdf"
	"math/rand"
	"time"
)

func main() {
	/*initType := gofpdf.InitType{
		OrientationStr: "P",
		UnitStr:        "mm",
		SizeStr:        "A5",
		Size:           gofpdf.SizeType{200.00, 800.00},
		FontDirStr:     "",
	}
	pdf := gofpdf.NewCustom(&initType)*/

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

	pdf.AddPage()
	pdf.SetFont("Arial", "", 8)
	pdf.CellFormat(65, 5, fmt.Sprintf("Invoice #: %d", rand.Intn(100)), "1", 0, "L", false, 0, "")
	pdf.CellFormat(65, 5, fmt.Sprintf("Date: %s", time.Now().Format("01 December 2006")), "1", 0, "L", false, 0, "")
	pdf.Ln(-1)

	pdf.CellFormat(43.33, 5, fmt.Sprintf("Customer: %s", "Waris Ali"), "1", 0, "L", false, 0, "")
	pdf.CellFormat(43.33, 5, fmt.Sprintf("Party: %s", "AbuZar Traders"), "1", 0, "L", false, 0, "")
	pdf.CellFormat(43.33, 5, fmt.Sprintf("Transport: %s", "Mazda"), "1", 0, "L", false, 0, "")
	pdf.Ln(-1)
	pdf.CellFormat(130, 5, fmt.Sprintf("Address: %s", "House no 284 unit no 2, Latifabad, Hyderabad"), "1", 0, "L", false, 0, "")
	pdf.Ln(6)

	pdf.SetFont("Arial", "B", 8)
	pdf.SetFillColor(240, 240, 240)

	align := []string{"C", "L", "C", "R", "R", "R", "R", "R"}
	colsWidth := []float64{6, 30, 9, 10, 15, 20, 20, 20}
	headers, contents := getTableData()
	for i, header := range headers {
		pdf.CellFormat(colsWidth[i], 5, header, "1", 0, "C", true, 0, "")
	}

	pdf.Ln(-1)
	pdf.SetFont("Arial", "", 8)
	pdf.SetFillColor(255, 255, 255)
	for _, line := range contents {
		for i, row := range line {
			pdf.CellFormat(colsWidth[i], 5, row, "1", 0, align[i], false, 0, "")
		}
		pdf.Ln(-1)
	}

	pdf.SetFooterFunc(func() {
		pdf.CellFormat(25, 5, "", "0", 0, "L", false, 0, "")
		pdf.CellFormat(20, 5, "Gross Amount", "1", 0, "L", false, 0, "")
		pdf.CellFormat(10, 5, fmt.Sprintf("%d", rand.Intn(1000)), "1", 0, "R", false, 0, "")
		pdf.CellFormat(15, 5, fmt.Sprintf(""), "0", 0, "L", false, 0, "")
		pdf.CellFormat(20, 5, fmt.Sprintf("%d", rand.Intn(1000)), "1", 0, "R", false, 0, "")
		pdf.CellFormat(20, 5, fmt.Sprintf("%d", rand.Intn(1000)), "1", 0, "R", false, 0, "")
		pdf.CellFormat(20, 5, fmt.Sprintf("%d", rand.Intn(1000)), "1", 0, "R", false, 0, "")
	})

	/*var buf bytes.Buffer
	err := pdf.Output(&buf)
	if err == nil {
		fmt.Printf("Length of buffer: %d\n", buf.Len())
		fmt.Printf("Length of buffer: %s\n", buf.String())
		defaultPrinter, _ := printer.Default()
		p, _ := printer.Open(defaultPrinter)
		defer p.Close()

		_, _ = p.Write(buf.Bytes())
		defer p.EndDocument()
		os.Exit(0)
	} else {
		fmt.Printf("Error generating PDF: %s\n", err)
	}*/

	err := pdf.OutputFileAndClose("hello1.pdf")

	if err != nil {
		fmt.Println(err.Error())
	}
}

func getTableData() ([]string, [][]string) {
	header := []string{"S #", "Item Description", "Unit", "Qty", "Price", "Amount", "Discount", "Total Amount"}
	var contents [][]string

	for counter := 1; counter < 28; counter++ {
		rand.Seed(time.Now().UnixNano())
		var quantities = randFloats(1.10, 500.98)
		var price = randFloats(1.10, 500.98)
		var amount = quantities * price
		var discountOnItem float64 = 10.0
		totalAmount := (discountOnItem / 100.0) * amount

		contents = append(contents, []string{fmt.Sprintf(" %d", counter), fmt.Sprintf("Row %d", counter),
			fmt.Sprintf("PCS"), fmt.Sprintf("%.2f", quantities), fmt.Sprintf("%.2f", price),
			fmt.Sprintf("%.2f", amount), fmt.Sprintf("%.2f %%", discountOnItem), fmt.Sprintf("%.2f", amount-totalAmount)})
	}

	return header, contents
}

func randFloats(min, max float64) float64 {
	return min + rand.Float64()*(max-min)
}
