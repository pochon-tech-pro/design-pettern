package adapter

import (
	"fmt"
)

type showFile struct {
}

func (s showFile) showPlain() {
	fmt.Println("Plain")
}

// ------------------------
// Embeddedでの実現方法
// ------------------------
type displaySourceFile struct {
	*showFile
}

func NewDisplaySourceFile() *displaySourceFile {
	return &displaySourceFile{
		&showFile{},
	}
}

func (dsf displaySourceFile) display() {
	dsf.showPlain()
}

func Run() {
	fmt.Println("hello adapter")

	client := NewDisplaySourceFile()
	client.display()
}

// ------------------------
// interfaceでの実現方法 (TypeScriptの方により近い)
// ------------------------
type displaySourceFile2 interface {
	display2()
}

type displayShowFile struct {
	*showFile
}

func NewDisplayShowFile() *displayShowFile {
	return &displayShowFile{&showFile{}}
}

func (dsf displayShowFile) display2() {
	dsf.showPlain()
}

func Run2() {
	fmt.Println("hello adapter ver interface")

	var client displaySourceFile2 = NewDisplayShowFile()
	client.display2()
}
