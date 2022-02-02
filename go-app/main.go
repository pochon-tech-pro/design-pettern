package main

import (
	"flag"
	"fmt"
	"go-app/behavioral/template_method"
	"go-app/creational/singleton"
	"go-app/structural/adapter"
)

func main() {
	fmt.Println("go run main.go ")

	flag.Parse() // ここで引数解析

	if flag.Arg(0) == "template_method" { //  go run main.go template_method
		template_method.Run()
	}

	if flag.Arg(0) == "singleton" { //  go run main.go singleton
		singleton.Run()
	}

	if flag.Arg(0) == "singleton2" { //  go run main.go singleton2
		singleton.Run2()
	}

	if flag.Arg(0) == "adapter" { //  go run main.go adapter
		adapter.Run()
	}

	if flag.Arg(0) == "adapter2" { //  go run main.go adapter2
		adapter.Run2()
	}
}
