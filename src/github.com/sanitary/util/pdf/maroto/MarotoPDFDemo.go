package main

import (
	"fmt"
	"github.com/johnfercher/maroto/pkg/consts"
	"github.com/johnfercher/maroto/pkg/pdf"
	"github.com/johnfercher/maroto/pkg/props"
	"math/rand"
	"time"
)

func main() {
	mpdf := pdf.NewMaroto(consts.Portrait, consts.A5)

	mpdf.RegisterHeader(func() {
		mpdf.SetBorder(false)
		mpdf.Row(5, func() {
			mpdf.Col(func() {
				mpdf.Text("AbuZar Traders", props.Text{
					Top:         0,
					Family:      consts.Helvetica,
					Style:       consts.Bold,
					Size:        12.0,
					Align:       consts.Center,
					Extrapolate: false,
				})
			})
		})

		mpdf.Row(5, func() {
			mpdf.Col(func() {
				mpdf.Text("Pathan colony, City gate, Hyderabad Mobile # 03012525361", props.Text{Align: consts.Center, Family: consts.Helvetica, Size: 8})
			})
		})
		mpdf.SetBorder(true)
	})

	invoiceNumber := fmt.Sprintf(" Invoice Number: %d", rand.Intn(1000))
	date := fmt.Sprintf(" Date: %v", time.Now().Format("01 January 2006"))
	mpdf.Row(5, func() {
		mpdf.Col(func() {
			mpdf.Text(invoiceNumber, props.Text{Top: 4, Align: consts.Left, Family: consts.Helvetica, Size: 8})
		})

		mpdf.Col(func() {
			mpdf.Text(date, props.Text{Top: 4, Align: consts.Left, Family: consts.Helvetica, Size: 8})
		})
	})

	customerName := fmt.Sprintf(" Customer: %s", "Noman Ali Abbasi")
	shopName := fmt.Sprintf(" Party: %s", "Abuzar Traders")
	transport := fmt.Sprintf(" Transport: %s", "Mazda")
	address := fmt.Sprintf(" Address: %s", "House no 284, Block D, Unit no 2, Latifabad, Hyderabad")
	mpdf.Row(5, func() {
		mpdf.Col(func() {
			mpdf.Text(customerName, props.Text{Top: 4, Extrapolate: true, Align: consts.Left, Family: consts.Helvetica, Size: 8})
		})

		mpdf.Col(func() {
			mpdf.Text(shopName, props.Text{Top: 4, Extrapolate: true, Align: consts.Left, Family: consts.Helvetica, Size: 8})
		})
		mpdf.Col(func() {
			mpdf.Text(transport, props.Text{Top: 4, Extrapolate: true, Align: consts.Left, Family: consts.Helvetica, Size: 8})
		})
	})

	mpdf.Row(5, func() {
		mpdf.Col(func() {
			mpdf.Text(address, props.Text{Top: 4, Extrapolate: true, Align: consts.Left, Family: consts.Helvetica, Size: 8})
		})
	})

	//Empty row
	mpdf.Row(5, func() {
	})
	mpdf.SetBorder(true)
	header, contents := getTableContents()
	mpdf.TableList(header, contents, props.TableList{
		HeaderHeight: 10,
		Align:        consts.Left,
		HeaderProp: props.Font{
			Family: consts.Helvetica,
			Style:  consts.Bold,
			Size:   8,
		},
		ContentProp: props.Font{
			Family: consts.Helvetica,
			Style:  consts.Normal,
			Size:   8,
		},
		HeaderContentSpace: 0.1,
	})

	mpdf.RegisterFooter(func() {
		mpdf.SetBorder(false)
		mpdf.Row(5, func() {
			mpdf.Col(func() {
				mpdf.Text("Grand Total: ", props.Text{Top: 5, Align: consts.Right, Family: consts.Helvetica, Size: 8})
			})

			mpdf.Col(func() {
				mpdf.Text("Signature", props.Text{Top: 5, Align: consts.Left, Family: consts.Helvetica, Size: 8})
			})
		})

		/*mpdf.Row(20, func() {
			mpdf.Col(func() {
				mpdf.Signature("Signature", props.Font{Family: consts.Helvetica, Size: 8})
			})

			mpdf.Col(func() {
				mpdf.Signature("Signature", props.Font{Family: consts.Helvetica, Size: 8})
			})
		})*/
	})

	err := mpdf.OutputFileAndClose("hello.pdf")
	if err != nil {
		return
	}
}

func getTableContents() ([]string, [][]string) {
	serialNumber := 1
	header := []string{"S#", "Item Description", "Unit", "Qty", "Price", "Amount", "Discount Amount", "Amount"}
	var contents [][]string

	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})

	serialNumber++
	contents = append(contents, []string{fmt.Sprintf("%d", serialNumber), "My Item 1", "PCs", "50", "50", "2500", "0", "2500"})
	return header, contents
}
