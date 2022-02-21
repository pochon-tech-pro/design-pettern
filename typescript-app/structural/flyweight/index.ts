// ----------------
// Flyweight Pattern
// 多くのオブジェクトを効率よく扱うことを目的とする
// クラスには状況により変わる情報(extrinsic)と変わらない情報(intrinsic)があり、変わらない情報を毎回インスタンス化するのはもったいない
//   商品クラスであれば、状況により変わる情報は在庫で変わらないのは商品名など
//   もったいない理由は、商品名や商品番号などはDBに永続化されてることが多く、インスタンスしまくると都度DBアクセスが発生するため。（メモリ消費量が大きい）
//   ちなみに、商品クラスに在庫数を持たせるのは得策ではない（インスタンス化するタイミングで在庫が変わってるかもしれない）
// Clientでインスタンスが必要になったときに、ファクトリに生成を依頼し、インスタンスを入手し、ファクトリは生成したインスタンスは保持しておく
// ObjectPoolパターンと似ている
// ----------------

import fs from "fs";

namespace FlyweightPattern {
    // intrinsicな情報を持つクラス
    // FlyweightおよびConcreteFlyweightに該当する
    export class Item {
        private readonly _code: string
        private readonly _name: string
        private readonly _price: number

        constructor(code: string, name: string, price: number) {
            this._code = code
            this._name = name
            this._price = price
        }

        public code = () => this._code
        public name = () => this._name
        public price = () => this._price
    }

    // FlyweightFactory: Clientが利用する、Flyweight型のインスタンスを生成・保持するクラス
    export class ItemFactory {
        private _pool: Item[] = []
        private static _instance?: ItemFactory = undefined

        private constructor(filename: string) {
            this.buildPool(filename)
        }

        public static getInstance(filename: string) {
            if (!this._instance) {
                this._instance = new ItemFactory(filename)
            }
            return this._instance
        }

        public getItem(code: string): Item { // PoolしているintrinsicばConcreteFlyweightを返す
            const target = this._pool.find(item => item.code() === code)
            if (!target) {
                throw new Error(`不正な商品番号です: ${code}`)
            }
            return target
        }

        private buildPool(filename: string) { // データ読み込み、プール初期化
            this._pool = []
            const buffer = fs.readFileSync(__dirname + '/' + filename)
            const filtered = buffer.toString().split('\n').filter(item => item !== '')
            this._pool = filtered.map(row => {
                const {0: id, 1: name, 2: price} = row.split(',')
                return new Item(id, name, Number(price))
            })
        }
    }

}


//---------------------
// Client
//---------------------
(() => {
    const dumpData = (console: (messages: string) => void) => (orders: FlyweightPattern.Item[]) => {
        orders.forEach((item) => {
            console(`${item.code()} - ${item.name()} - ${item.price()}`)
        })
    }

    const factory = FlyweightPattern.ItemFactory.getInstance("Item.txt")
    const orders = []
    orders.push(factory.getItem("1001"))
    orders.push(factory.getItem("1002"))
    orders.push(factory.getItem("1003"))

    dumpData(console.log)(orders)
})()
