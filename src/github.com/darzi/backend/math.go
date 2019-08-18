package mymath

type mymath struct{}

func New() mymath {
	return mymath{}
}

func (mymath) Add(num1, num2 float64) float64 {
	return num1 + num2
}

func (mymath) Sub(num1, num2 float64) float64 {
	return num1 - num2
}

func (mymath) Mul(num1, num2 float64) float64 {
	return num1 * num2
}

func (mymath) Div(num1, num2 float64) float64 {
	return num1 / num2
}

func (mymath) Percentage(num1 float64) float64 {
	return num1 / 100
}
