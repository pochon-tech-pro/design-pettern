// ----------------
// FacadePattern
// あるクラスを利用するために複数の他のクラスを知っている必要があったりなど、クラス同士の複雑な関係を意識しなくても容易に扱うためのAPIを提供する
// ClientがFacadeを通じてSubSystemにアクセスする
// SubSystemを構成するClass群は、Facadeの存在を知らず、FacadeはClientの要求をSubSystem内の適切なClassに委譲
// ClientとSubSystemが疎結合になる
// ----------------

// ----------------
// SubSystem
// ----------------
class Item {
    private readonly _id: number
    private readonly _price: number

    constructor(id: number, price: number) {
        this._id = id
        this._price = price
    }

    public id(): number {
        return this._id
    }

    public price(): number {
        return this._price
    }
}

class OrderItem {
    private readonly _item: Item
    private readonly _amount: number

    constructor(item: Item, amount: number) {
        this._item = item
        this._amount = amount
    }

    public item(): Item {
        return this._item
    }

    public amount(): number {
        return this._amount
    }
}

class Order {
    private _items: OrderItem[]

    constructor() {
        this._items = []
    }

    public addItem(orderItem: OrderItem): void {
        this._items = [...this._items, orderItem]
    }

    public items(): OrderItem[] {
        return this._items
    }
}

class ItemDAO {
    private _items: Item[]

    constructor() {
        // DB等からRawDataがくる想定
        this._items = [
            (new Item(1, 100)),
            (new Item(2, 200)),
            (new Item(3, 300)),
        ]
    }

    public findById(id: number): Item {
        return this._items.find(item => item.id() === id) ?? new Item(0, 0)
    }

    public adjustInventory(orderItem: OrderItem): void {
        console.log(`商品ID${orderItem.item().id()}を${orderItem.amount()}だけ減らしました。`)
    }
}

class OrderDao {
    public static create(order: Order): void {
        order.items().forEach((orderItem) => {
            console.log(`購入商品: ${orderItem.item().id()}`)
            console.log(`合計金額: ${orderItem.item().price() * orderItem.amount()}`)
        });
    }
}

// ----------------
// Facade
// ----------------
class OrderManager {

    // Facadeを用意し、注文をするには、「在庫調整のあと注文登録の順序がある」ということを利用者側に漏らさないようにしている。
    // FacadeのAPIがこのorder()に該当する
    public static order(order: Order): void {
        const itemDao = (new ItemDAO)
        order.items().forEach(orderItem => {
            itemDao.adjustInventory(orderItem)
        });

        OrderDao.create(order)
    }
}

// ----------------
// Client
// ----------------
const order = new Order()
const itemDao = new ItemDAO()

order.addItem(new OrderItem(itemDao.findById(1), 1))
order.addItem(new OrderItem(itemDao.findById(2), 10))
order.addItem(new OrderItem(itemDao.findById(3), 100))

OrderManager.order(order)