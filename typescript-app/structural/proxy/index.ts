// ----------------
// Proxy Pattern
// 身代わりとなるオブジェクトを通じて、間接的に自分のオブジェクトにアクセスさせるためのパターン
// Windowsのショートカット機能のようなもの。
// ----------------

namespace ProxyPattern { // 他のファイルとかと定義が重複するので名前空間で整理
    class Item {
        private readonly _id: number
        private readonly _name: string

        constructor(id: number, name: string) {
            this._id = id
            this._name = name
        }

        public id = () => this._id
        public name = () => this._name
    }

    // Subject: RealSubjectクラスとProxyクラスが提供する共通のAPIを定義
    export interface ItemDAO {
        findById(id: number): Item
    }

    // RealSubject: Subjectクラスのサブクラスで、Subjectクラスで宣言されたメソッドを実装。このクラスが実際に処理を提供。
    export class DBItemDAO implements ItemDAO {
        public findById(id: number): Item {
            const data = [new Item(1, "A"), new Item(2, "B")]
            const result = data.find(item => item.id() === id)
            return result ? result : new Item(0, "")
        }
    }

    // これもRealSubject
    export class MockItemDAO implements ItemDAO {
        public findById(id: number): Item {
            return new Item(id, 'Mock')
        }
    }

    // Proxy: Subjectクラスのサブクラス。しかし具体的な処理は内部に保持するRealSubjectに任せる。
    export class ItemDAOProxy implements ItemDAO {
        private _dao: ItemDAO       // 処理を任せるRealSubjectを保持する
        private _cache: Item[] = [] // キャッシュ機能用

        constructor(dao: ItemDAO) {
            this._dao = dao
        }

        public findById(id: number): Item {
            if (this._cache.some(each => each.id() === id)) {
                const cached = this._cache.find(each => each.id() === id)
                if (!cached) throw new Error(`不明なエラーによりCacheに保持したItemを取得できませんでした: ${id}`)
                console.log('Cacheのものを返します。')
                return cached
            }

            const item = this._dao.findById(id)
            this._cache.push(item)
            return item
        }
    }
}

// -----------------
// Client
// -----------------
(async () => {
    // ----------------------
    // 直接RealSubject呼ぶ場合
    // ----------------------
    const run = (dao: ProxyPattern.ItemDAO) => (itemId: number) => console.log(dao.findById(itemId).name())
    const mockRun = run(new ProxyPattern.MockItemDAO())
    const dbRun = run(new ProxyPattern.DBItemDAO())

    mockRun(1)
    dbRun(1)

    console.log("----------------------")
    // ------------------
    // Proxy経由で呼ぶ場合
    // ------------------
    const mockProxy = new ProxyPattern.ItemDAOProxy(new ProxyPattern.MockItemDAO())
    const dbProxy = new ProxyPattern.ItemDAOProxy(new ProxyPattern.DBItemDAO())

    console.log(mockProxy.findById(1).name())
    console.log(dbProxy.findById(1).name())
    console.log(mockProxy.findById(1).name())
})();