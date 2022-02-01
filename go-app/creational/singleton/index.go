package singleton

import (
	"errors"
	"fmt"
	"math/rand"
)

type Single struct {
	id string
}

var sharedInstance *Single

func GetInstance() *Single {
	if sharedInstance == nil {
		id, _ := makeRandomStr(6)
		sharedInstance = &Single{id: id}
	}
	return sharedInstance
}

func makeRandomStr(digit uint) (out string, err error) {
	const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	b := make([]byte, digit)
	if _, _err := rand.Read(b); _err != nil {
		err = errors.New("Unexpected Error")
		return
	}

	for _, v := range b { // LETTERSからランダムに文字を取得
		out += string(LETTERS[int(v)%len(LETTERS)])
	}

	return
}

func Run() {
	fmt.Println("hello singleton")

	s1 := GetInstance()
	s2 := GetInstance()

	fmt.Printf("%v, %v, %v\n", s1.id, s2.id, s1.id == s2.id)
}
