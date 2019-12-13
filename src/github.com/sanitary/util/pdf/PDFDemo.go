package main

import (
	"fmt"
	"github.com/jung-kurt/gofpdf"
	"math/rand"
	"os/exec"
	"runtime"
)

func main(){
	/*initType := gofpdf.InitType{
		OrientationStr: "P",
		UnitStr:        "mm",
		SizeStr:        "A5",
		Size:           gofpdf.SizeType{200.00, 800.00},
		FontDirStr:     "",
	}
	pdf := gofpdf.NewCustom(&initType)*/

	pdf := gofpdf.New("P", "mm", "A5", "")
	pdf.SetLineWidth(0.1)
	pdf.SetHeaderFunc(func() {
		pdf.SetFont("Arial", "B", 12)
		pdf.CellFormat(130, 5, "Hello, world", "", 0, "C", false, 0, "")
		pdf.Ln(-1)

		pdf.SetFont("Arial", "", 8)
		pdf.CellFormat(130, 5, "Street addresses: 445 Mount Eden Road, Mount Eden, Auckland", "", 0, "C", false, 0, "")
		pdf.Ln(-1)

		pdf.SetFont("Arial", "B", 8)
		pdf.CellFormat(130, 7, "Hello, world", "", 0, "C", false, 0, "")
		pdf.Ln(-1)
	})

	pdf.AddPage()
	pdf.SetFont("Arial", "", 8)
	pdf.CellFormat(65, 5, "Street addresses:", "TLR", 0, "L", false, 0, "")
	pdf.CellFormat(65, 5, "Street addresses:", "TLR", 1, "L", false, 0, "")
	pdf.CellFormat(43.33, 5, "Street addresses:", "TLR", 0, "L", false, 0, "")
	pdf.CellFormat(43.33, 5, "Street addresses:", "TLR", 0, "L", false, 0, "")
	pdf.CellFormat(43.33, 5, "Street addresses:", "TLR", 1, "L", false, 0, "")
	pdf.CellFormat(130, 5, "Hello, world", "TLRB", 0, "L", false, 0, "")
	pdf.Ln(6)

	pdf.SetFont("Arial", "B", 8)
	pdf.SetFillColor(240, 240, 240)

	align := []string{"C", "L", "C", "R", "R", "R", "R", "R",}
	colsWidth := []float64{6, 30, 9, 10, 15, 20, 20, 20, }
	headers, contents := getTableData()
	for i, header := range headers {
		pdf.CellFormat(colsWidth[i], 5, header, "B", 0, "C", true, 0, "")
	}

	pdf.Ln(-1)
	pdf.SetFont("Arial", "", 8)
	pdf.SetFillColor(255, 255, 255)
	for _, line := range contents {
		for i, row := range line {
			pdf.CellFormat(colsWidth[i], 5, row, "B", 0, align[i], false, 0, "")
		}
		pdf.Ln(-1)
	}

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

	err := pdf.OutputFileAndClose("hello.pdf")

	if err != nil {
		fmt.Println(err.Error())
	}
	
	if runtime.GOOS == "windows" {
		cmd := exec.Command("bin/PDFtoPrinter.exe", ""/*, "HP LaserJet P2055dn UPD PCL 6"*/)
		out, err := cmd.Output()
		if err == nil {
			fmt.Printf("%s", string(out))
		}
	}
}

func getTableData() ([]string, [][]string) {
	header := []string{ "S #", "Col 2", "Unit", "Col 4", "Col 5", "Col 6", "Col 7", "Col 8"}
	var contents [][]string

	for counter := 1 ; counter < 100 ; counter++ {
		contents = append(contents, []string{fmt.Sprintf(" %d", counter), fmt.Sprintf("Row %d", counter),
			fmt.Sprintf("PCS"), fmt.Sprintf("%d", rand.Intn(100)), fmt.Sprintf("Row %d", counter),
			fmt.Sprintf("Row %d", counter), fmt.Sprintf("Row %d", counter), fmt.Sprintf("Row %d", counter)})
	}

	return header, contents
}
