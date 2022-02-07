// ----------------
// FacadePattern
// オブジェクトに対する反復操作をおこなうための統一APIを提供する
// リストの内部構造が分からない状況でも、リストから要素を取り出す役割を担うものを提供する
// 利用者に、どのような構造を持つリストなのかを意識させないようにできる
// ----------------

class Employee {
    private readonly _name: string
    private readonly _age: number

    constructor(name: string, age: number) {
        this._name = name
        this._age = age
    }

    public name(): string {
        return this._name
    }

    public age(): number {
        return this._age
    }
}

interface aggregate { // Aggregate
    iterator(): iterator<Employee>;
}

class Employees implements aggregate { // ConcreteAggregate
    private readonly _employee: Employee[]
    private _lastIdx: number = 0

    public constructor(size: number) {
        this._employee = new Array(size)
    }

    public add(employee: Employee): void {
        if (this._lastIdx+1 > this._employee.length) {
            throw new Error("Size Over")
        }
        this._employee[this._lastIdx++] = employee
    }

    public employee(): Employee[] {
        return this._employee
    }

    public count(): number {
        return this._employee.length
    }

    public iterator(): iterator<Employee> {
        return new EmployeeIterator(this)
    }
}

// Note: libを実装する方がよい。https://typescript-jp.gitbook.io/deep-dive/future-javascript/iterators
interface iterator<T> { // iterator
    getNext(): T

    hasNext(): boolean
}

class EmployeeIterator implements iterator<Employee> {// ConcreteIterator
    private _collection: Employees
    private _position: number = -1

    constructor(collection: Employees) {
        this._collection = collection
    }

    public getNext(): Employee {
        this._position++
        return this._collection.employee()[this._position]
    }

    public hasNext(): boolean {
        return this._position + 1 < this._collection.count()
    }
}

// Client
const employees = new Employees(3)
employees.add(new Employee("A", 10))
employees.add(new Employee("B", 11))
employees.add(new Employee("C", 12))

const it: iterator<Employee> = employees.iterator()
while (it.hasNext()) {
    console.log(it.getNext())
}