// ----------------
// Abstract Factory Pattern
// 具体的なものを抽象化したものを扱うところがポイント
// 具体的なクラスを明確にすることなく、関連し合うオブジェクトの集まりを生成する
// モックを整合性を保ちながら、正式なDAOに簡単に切り替えるときとかに使える
// Clientから見えるのは抽象製品（AbstractProduct）と抽象工場（AbstractFactory）のみ
// ----------------
namespace AbstractFactoryPattern { // 他のファイルとかと定義が重複するので名前空間で整理
    type Item = { id: number; name: string }
    type Order = { id: number; items: Item[] }

    export interface DAOFactory { // AbstractFactory
        createItemDAO(): ItemDAO

        createOrderDAO(): OrderDAO
    }

    export class DBFactory implements DAOFactory {  // ConcreteFactory
        createItemDAO(): ItemDAO {
            return new DBItemDAO()
        }

        createOrderDAO(): OrderDAO {
            return new DBOrderDAO(this.createItemDAO())
        }
    }

    export class MockFactory implements DAOFactory {  // ConcreteFactory
        createItemDAO(): ItemDAO {
            return new MockItemDAO()
        }

        createOrderDAO(): OrderDAO {
            return new MockOrderDAO()
        }
    }

    export interface ItemDAO { // AbstractProduct1
        findById(id: number): Item
    }

    export interface OrderDAO { // AbstractProduct2
        findById(id: number): Order
    }

    class DBItemDAO implements ItemDAO { // ConcreteProduct1-1
        private readonly _items: Item[]

        constructor() {
            this._items = [ // 本来はDBから取得
                {id: 100, name: '商品A'},
                {id: 101, name: '商品B'},
                {id: 102, name: '商品C'},
            ]
        }

        findById(id: number): Item {
            return this._items.find(item => item.id === id) ?? {id: 0, name: ''}
        }
    }

    class DBOrderDAO implements OrderDAO { // ConcreteProduct2-1
        private _orders: Order[]

        constructor(itemDAO: ItemDAO) {
            this._orders = [ // 本来はDBから取得
                {id: 1000, items: [100, 101, 102].map(itemId => itemDAO.findById(itemId))}
            ]
        }

        findById(id: number): Order {
            return this._orders.find(order => order.id === id) ?? {id: 0, items: []}
        }
    }

    class MockItemDAO implements ItemDAO { // ConcreteProduct1-2
        findById(id: number): Item {
            return {id: 999, name: 'Mock商品'}
        }
    }

    class MockOrderDAO implements OrderDAO { // ConcreteProduct1-2
        findById(id: number): Order {
            return {
                id: 9999, items: [
                    {id: 999, name: 'Mock商品'},
                    {id: 999, name: 'Mock商品'},
                    {id: 998, name: 'Mock商品!!!!!'},
                ]
            }
        }
    }
}

// -----------------
// Client
// -----------------
(async () => {
    const readUserInput = (question: string) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve, _) => {
            readline.question(question, (answer: string) => {
                resolve(answer);
                readline.close();
            });
        });
    }

    const driver = await readUserInput('Which use DB or Mock ?? ');
    let factory: AbstractFactoryPattern.DAOFactory
    if (driver  === 'DB') {
        factory = new AbstractFactoryPattern.DBFactory()
    } else if (driver === 'Mock') {
        factory = new AbstractFactoryPattern.MockFactory()
    } else {
        throw new Error('Invalid Factory')
    }

    const itemDAO: AbstractFactoryPattern.ItemDAO = factory.createItemDAO()
    const orderDAO: AbstractFactoryPattern.OrderDAO = factory.createOrderDAO()
    console.log(itemDAO.findById(999))
    console.log(orderDAO.findById(9999))
})();