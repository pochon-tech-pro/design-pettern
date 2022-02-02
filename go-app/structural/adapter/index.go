package adapter

import (
	"fmt"
)

// ------------------------
// Embeddedでの実現方法
// ------------------------
type showFile struct {
}

func (s showFile) showPlain() {
	fmt.Println("Plain")
}

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
