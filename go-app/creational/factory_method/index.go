package factory_method

import (
	"errors"
	"fmt"
	"os"
	"strings"
)

type Reader interface { // Product
	display()
}

type CSVFileReader struct { // ConcreteProduct
	filepath string
}

func newCSVFileReader(filename string) *CSVFileReader {
	dir, err := os.Getwd()
	if err != nil {
		fmt.Printf("Dir %v does not exsits\n", err)
	}
	return &CSVFileReader{filepath: dir + filename}
}

func (csv CSVFileReader) display() {
	fmt.Println("CSV FILE READER")
}

type XMLFileReader struct { // ConcreteProduct
	filepath string
}

func newXMLFileReader(filename string) *XMLFileReader {
	dir, err := os.Getwd()
	if err != nil {
		fmt.Printf("Dir %v does not exsits\n", err)
	}
	return &XMLFileReader{filepath: dir + filename}
}

func (csv XMLFileReader) display() {
	fmt.Println("XML FILE READER")
}

type ReaderFactory struct{}

func (rf ReaderFactory) create(filename string) (Reader, error) {
	return rf.createFileReader(filename)
}

func (rf ReaderFactory) createFileReader(filename string) (Reader, error) {
	pos := strings.LastIndex(filename, ".")
	if filename[pos:] == ".csv" {
		return newCSVFileReader(filename), nil
	}
	if filename[pos:] == ".xml" {
		return newXMLFileReader(filename), nil
	}
	return nil, errors.New(fmt.Sprintf("想定外のFileです : %+v", filename))
}

func Run() {
	fmt.Println("hello factory_method")

	reader, err := ReaderFactory{}.create("/Sample.csv")
	if err != nil {
		fmt.Printf("%#v", err)
	}
	reader.display()
}
