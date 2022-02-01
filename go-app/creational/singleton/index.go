package singleton

import (
	"errors"
	"fmt"
	"math/rand"
	"time"
)

type Single struct {
	id string
}

// --------------------------
// thread safe ではないシングルトン
// --------------------------
var sharedInstance *Single

func GetInstance() *Single {
	if sharedInstance == nil {
		time.Sleep(2000) // 同時にGetInstanceが呼ばれるようわざと時間をかける
		id, _ := makeRandomStr(6)
		sharedInstance = &Single{id: id}
	}
	return sharedInstance
}

// --------------------------
// thread safe なシングルトン
// --------------------------
var sharedInstanceSafe = newSingleSafe()

func newSingleSafe() *Single {
	id, _ := makeRandomStr(8)
	return &Single{id: id}
}

func GetInstanceSafe() *Single {
	return sharedInstanceSafe
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

func routineRun(ch chan *Single) {
	ch <- GetInstance()
}

func routineSafeRun(ch chan *Single) {
	ch <- GetInstanceSafe()
}

func Run2() {
	fmt.Println("hello singleton thread safe ..?")

	ch := make(chan *Single, 3)
	go routineRun(ch)
	go routineRun(ch)
	go routineRun(ch)
	fmt.Printf("%#v\n", <-ch)
	fmt.Printf("%#v\n", <-ch)
	fmt.Printf("%#v\n", <-ch)

	ch2 := make(chan *Single, 3)
	go routineSafeRun(ch2)
	go routineSafeRun(ch2)
	go routineSafeRun(ch2)
	fmt.Printf("%#v\n", <-ch2)
	fmt.Printf("%#v\n", <-ch2)
	fmt.Printf("%#v\n", <-ch2)
}
