package main

import (
	"github.com/johnfercher/maroto/pkg/consts"
	"github.com/johnfercher/maroto/pkg/pdf"
)

func main() {
	mpdf := pdf.NewMaroto(consts.Portrait, consts.A4)
	err := mpdf.OutputFileAndClose("hello.pdf")
	if err != nil {
		return
	}
}
