package test

import "testing"
import (
	math "github.com/darzi/backend"
)

type data []struct {
	Num1, Num2, Result float64
}

func TestMymath_Add(t *testing.T) {
	math := math.New()
	add := math.Add(3, 4)

	if 7 != add {
		t.Errorf("Result should be 7, but got %v", add)
	}
}

func TestMymath_Sub(t *testing.T) {
	math := math.New()
	subtract := math.Sub(3, 4)
	if -1 != subtract {
		t.Errorf("Result should be -1, but got %v", subtract)
	}
}

func TestMymath_Mul(t *testing.T) {
	math := math.New()
	multiple := math.Mul(3, 4)
	if 12 != multiple {
		t.Errorf("Result should be 12, but got %v", multiple)
	}
}

func TestMymath_Div(t *testing.T) {
	math := math.New()
	divide := math.Div(4, 4)
	if 1 != divide {
		t.Errorf("Result should be 0, but got %v", divide)
	}
}

func TestMymath_Percentage(t *testing.T) {
	math := math.New()
	percentage := math.Percentage(2.5)
	if 0.025 != percentage {
		t.Errorf("Result should be 0.025, but got %v", percentage)
	}
}
