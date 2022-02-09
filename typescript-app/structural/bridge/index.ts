// ----------------
// Bridge Pattern
// 「何をする」＝「ソートをする」、「どうやって実装するか」＝「バブル？ヒープ？クイック？」
// 「何をするか」「どうやって実現するか」を分けて考えると、機能の拡張は「何を」の変更のみで、実装方法の変更は「どうやって」の変更のみで済む
// つまり、「機能を提供するクラス」と「実装を提供するクラス」に分けて、それぞれを独立に変更できるようにするパターン。
// ClientはAbstraction（何をするのかクラス）を使い、Abstractionが持つImplementor（どうやってのクラス）が提供する機能をClientに提供される
// ----------------

import * as fs from 'fs';

namespace BridgePattern {

    interface DataSource { // Implementor
        open(): void

        read(): string

        close(): void
    }

    export class FileDataSource implements DataSource { // ConcreteImplementor
        private readonly _filepath: string
        private _handler?: number

        constructor(filename: string) {
            this._filepath = __dirname + '/' + filename
        }

        public open(): void {
            this._handler = fs.openSync(this._filepath, "r")
        }

        public read(): string {
            if (this._handler === undefined) {
                throw new Error('Not Opened')
            }
            const size = fs.fstatSync(this._handler).size
            const buffer = Buffer.alloc(size);
            fs.readSync(this._handler, buffer, 0, size, 0);
            return buffer.toString();
        }

        public close(): void {
            if (this._handler === undefined) {
                throw new Error('Not Opened')
            }
            fs.closeSync(this._handler)
        }
    }

    // 利用者側に提供するAPIを定義している
    // このClassには、実装側の具体的なClass名（FileDataSource）は出てこない＝具体的な実装を意識することなく、利用者側にAPIを提供
    export class Listing { // Abstraction「何をするか」
        private _dataSource: DataSource

        constructor(dataSource: DataSource) {
            this._dataSource = dataSource
        }

        public open(): void {
            this._dataSource.open()
        }

        public read(): string {
            return this._dataSource.read()
        }

        public close(): void {
            this._dataSource.close()
        }
    }

    // Listingを継承してさらに新しい機能をが追加される
    // このクラスにも実装側の具体的なClass名は出てこない。
    export class ExtendedListing extends Listing { // RefinedAbstraction
        constructor(dataSource: DataSource) {
            super(dataSource);
        }

        public readWithAnnotation(): string {
            return "@" + this.read()
        }
    }
}


// -----------------
// Client
// -----------------
(async () => {
    const l1 = new BridgePattern.Listing(new BridgePattern.FileDataSource('Sample.txt'))
    const l2 = new BridgePattern.ExtendedListing(new BridgePattern.FileDataSource('Sample.txt'))

    try {
        l1.open()
        l2.open()
    } catch (e) {
        console.log(e)
    }

    console.log(l1.read())
    console.log(l2.readWithAnnotation())

    l1.close()
    l2.close()
})();
