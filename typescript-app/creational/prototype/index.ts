// ----------------
// Prototype Pattern
// 原型となるインスタンスをコピーして新しいインスタンスを生成するパターン。
// 内部状態が不規則なオブジェクトのコピーを作りたい時とかに便利。
// ----------------
namespace PrototypePattern { // 他のファイルとかと定義が重複するので名前空間で整理

    // Prototype: コピーするためのメソッドを定義する親クラス。Clientが利用する。
    interface Prototype {
        clone(): Prototype
    }

    // ConcretePrototype: Prototypeのサブクラスで、Prototypeで定義されたコピーメソッドを実装する
    export class Item implements Prototype { // ConcretePrototype
        public code: string
        public name: string
        public price: number

        public constructor(item?: Item) {
            this.code = item && item.code || ''
            this.name = item && item.name || ''
            this.price = item && item.price || 0
        }

        public clone = (): Item => new Item(this)

        public dumpData = () => console.log(`商品番号: ${this.code}, 商品名: ${this.name}, 金額: ${this.price}`)
    }


}

// -----------------
// Client
// -----------------
(async () => {
    const item1 = new PrototypePattern.Item()
    item1.code = 'A-001'
    item1.name = '商品A'
    item1.price = 2500

    const item2 = item1.clone()

    item1.dumpData()
    item2.dumpData()
})();