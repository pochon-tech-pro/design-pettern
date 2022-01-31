package main

import (
	"flag"
	"fmt"
	"go-app/behavioral/template_method"
)

func main() {
	fmt.Println("go run main.go ")

	flag.Parse() // ここで引数解析

	if flag.Arg(0) == "template_method" { //  go run main.go template_method
		template_method.Run()
	}
}
