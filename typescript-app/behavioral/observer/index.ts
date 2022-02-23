// ----------------
// Observer Pattern
// observe: 観測者、観察者
// 観察対象のオブジェクトが変化した時に通知してもらい、その変化を他のオブジェクトにも伝えるパターン。
// 状態変化に応じた処理を行う場合に有効なパターンである。
// クラス同士の結合をゆるく保ちながら、協調動作を実現するパターンで観測対象クラスと観測するクラスを用意して構成する。
// ※ ちなみに、似ているのにPub/Subパターンがあるが、Pub/SubではBrokerが間にあったりと厳密には異なる(https://coffee-nominagara.com/2018-06-04-150921)
//   似ているのは、Publisher = Subject, Subscriber = Observer に似た役割を持つというところくらい。
// ----------------

//         -----notify()------> Observer1
// Subject -----notify()------> Observer2
//         -----notify()------> Observer3
namespace ObserverPattern {
    // Subject: "観測対象"のクラス。内部には観測クラスであるObserver型のオブジェクトを保持し、Observerの登録・削除・Observerへの通知を提供
    // ConcreteSubject: Subjectのサブクラスで、Observerクラスに影響する状態を保持
    export class Cart { // SubjectとConcreteSubjectに相当
        private _items: string[] = []
        private _listeners: Listener[] = [] // Observer型のオブジェクトを保持する配列

        public addItem(item: string) {
            this._items.push(item)
            this.notify()
        }

        public removeItem(item: string) {
            this._items = this._items.filter(each => each !== item)
            this.notify()
        }

        public hasItem(item: string): boolean {
            return !!this._items.find(each => each === item)
        }

        public getItems() {
            return this._items
        }

        public addListener(listener: Listener) { // Observerの登録
            this._listeners.push(listener)
        }

        public removeListener(listener: Listener) { // Observerの削除
            this._listeners = this._listeners.filter(each => each !== listener)
        }

        notify(): void { // Observerへの通知
            this._listeners.forEach(listener => {
                listener.update(this)
            })
        }
    }

    // Observer: "観測"クラス。Subjectから通知を受け取るためのAPIを定義
    interface Listener {  // Observer
        update(cart: Cart): void
    }

    // ConcreteObserver: Observerクラスのサブクラス。通知を受け取った場合の具体的な処理内容を記述。
    // カートに車を追加したらもれなくカービスが1つだけ追加される
    export class PresentListener implements Listener { // ConcreteObserver
        private static TARGET_ITEM = '車'
        private static PRESENT_ITEM = 'カーナビ'

        public update(cart: Cart) {
            if (cart.hasItem(PresentListener.TARGET_ITEM)
                && !cart.hasItem(PresentListener.PRESENT_ITEM)) {
                cart.addItem(PresentListener.PRESENT_ITEM)
            }
        }
    }

    export class LoggingListener implements Listener {
        public update(cart: Cart) {
            console.log(`${(new Date()).toLocaleString()}: current items in cart => ${cart.getItems()}`)
        }
    }
}

//---------------------
// Client
//---------------------
(() => {
    const setupCart = () => {
        const cart = new ObserverPattern.Cart()
        cart.addListener(new ObserverPattern.LoggingListener()) // 順番は気にした方がよい。
        cart.addListener(new ObserverPattern.PresentListener())
        return cart
    }

    const cart = setupCart()
    cart.addItem('テレビ')
    cart.addItem('冷蔵庫')
    cart.addItem('車')
})()
