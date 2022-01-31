package template_method

import "fmt"

type Player interface { // TemplateMethod
	header()
	body()
	footer()
}

type AbstractDisplay struct { // AbstractClass
	Player
	data []string
}

func (ad AbstractDisplay) Display() {
	ad.header()
	ad.body()
	ad.footer()
}

type ListDisplay struct {
	*AbstractDisplay
}

func NewListDisplay(data []string) (out *ListDisplay) {
	out = &ListDisplay{
		AbstractDisplay: &AbstractDisplay{data: data},
	}
	out.Player = out
	return
}

func (l ListDisplay) header() {
	fmt.Println("<dl>")
}
func (l ListDisplay) body() {
	for idx, each := range l.data {
		fmt.Printf("<dt> %d </dt>\n", idx)
		fmt.Printf("<dd> %v </dd>\n", each)
	}
}
func (l ListDisplay) footer() {
	fmt.Println("</dl>")
}

type TableDisplay struct {
	*AbstractDisplay
}

func NewTableDisplay(data []string) (out *TableDisplay) {
	out = &TableDisplay{
		AbstractDisplay: &AbstractDisplay{data: data},
	}
	out.Player = out
	return
}

func (l TableDisplay) header() {
	fmt.Println("<table>")
}
func (l TableDisplay) body() {
	for idx, each := range l.data {
		fmt.Println("<tr>")
		fmt.Printf("<th> %d </th>\n", idx)
		fmt.Printf("<td> %v </td>\n", each)
		fmt.Println("</tr>")
	}
}
func (l TableDisplay) footer() {
	fmt.Println("</table>")
}

func Run() {
	fmt.Println("hello template_method")

	inputs := []string{"山田太郎", "田中太郎", "佐藤太郎"}

	listDisplay := NewListDisplay(inputs)
	tableDisplay := NewTableDisplay(inputs)

	listDisplay.Display()
	tableDisplay.Display()
}
