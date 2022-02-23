// ----------------
// Memento Pattern
// 別名Snapshotパターンとも呼ばれる。
// ある時点のオブジェクトの記憶を保存し、あとで思い出せるようにするパターン。
// Undo機能を思い浮かべるとイメージしやすい。
// ある状態の時点でのオブジェクト内部の状態、つまりオブジェクト内部に保持している値を保持しておき、状態変化した場合でもその状態に戻せるようにする。
// 記憶を保存する専用クラスとその保存を管理するクラスから構成される。
// ----------------
namespace MementoPattern {
    // Memento: Originatorオブジェクトの記憶を保持する記憶用クラスで、Originatorオブジェクトの内部状態を保持。
    // 厳密には、Originator以外のオブジェクトによってアクセスされないようにする必要がある。
    export class DataSnapshot { // Mementoに相当
        private _data: Data
        private readonly _text: string // 記録
        constructor(data: Data) {
            this._data= data
            this._text = data.text
        }

        public restore() {
            this._data.text = this._text
        }
    }

    // Originator: オブジェクトの内部状態を保存される側のクラス
    export class Data { // Originator
        text: string = ''
    }

    // Caretaker: Mementoオブジェクトを管理するクラス
    export class DataCaretaker {
        private _dataSnapshots: DataSnapshot[] = []

        public add(snapshot: DataSnapshot) {
            this._dataSnapshots.push(snapshot)
        }

        public undo(): void {
            if (this._dataSnapshots.length > 0) {
                const snapshot = this._dataSnapshots.pop()
                snapshot?.restore()
            } else {
                console.log("undoできません。")
            }
        }
    }
}

//---------------------
// Client
//---------------------
(() => {
    const data = new MementoPattern.Data()
    const caretaker = new MementoPattern.DataCaretaker()
    const snapshot = (data: MementoPattern.Data) => new MementoPattern.DataSnapshot(data)

    data.text = '1'
    console.log(data.text)
    caretaker.add(snapshot(data))

    data.text = '2'
    console.log(data.text)
    caretaker.add(snapshot(data))

    caretaker.undo()
    console.log(data.text)

    caretaker.undo()
    console.log(data.text)

    data.text = '3'
    console.log(data.text)
    caretaker.add(snapshot(data))

    caretaker.undo()
    console.log(data.text)
})()
