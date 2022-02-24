// ----------------
// Strategy Pattern
// アルゴリズムをクラスとして定義し、動的に機能を切り替えられるようにする。
// 処理をクラスとして定義して、Clientにアクセスさせるための共通APIを用意しておくのが特徴的。
// ContextクラスがStrategyIFを属性に持ち、必要に応じてStrategyの具像クラスを切り替えられる設計パターン。
// DIとの違い: https://woshidan.hatenablog.com/entry/2016/02/20/123000
//   DIパターンを実装したFWは、それを手動で行わずに自動で行う方法を用意し、具像クラスを切り替えやすくする。（切り替える内容のあるファイルをDIコンテナ）
// ----------------

namespace StrategyPattern {
    // Strategy: それぞれの処理に共通のAPIを定義。ContextクラスからそのAPIを通じて、ConcreteStrategyの具体的な処理を呼ぶ
    interface SortStrategy {
        sort(data: number[]): number[]
    }

    // ConcreteStrategy: Strategyクラスで定義されたAPIを実装したクラス
    export class AscSortStrategy implements SortStrategy {
        public sort(data: number[]): number[] {
            return data.sort((left, right) => left - right)
        }
    }

    // ConcreteStrategy: Strategyクラスで定義されたAPIを実装したクラス
    export class DescSortStrategy implements SortStrategy {
        public sort(data: number[]): number[] {
            return data.sort((left, right) => right - left)
        }
    }

    // Context: Strategy型のオブジェクトを内部に保持し、具体的な処理をそのオブジェクトに委譲
    export class SortContext {
        private _strategy?: SortStrategy

        public setStrategy(strategy: SortStrategy) {
            this._strategy = strategy
        }

        sort(data: number[]): number[] {
            if (!this._strategy) throw new Error('ソート戦略を設定してください。')
            return this._strategy.sort(data)
        }
    }
}

//---------------------
// Client
//---------------------
(() => {
    const print = (data: number[]) => console.log(data)
    const data = [3,7,1]

    const sorter = new StrategyPattern.SortContext()
    // print(sorter.sort(data))

    sorter.setStrategy(new StrategyPattern.AscSortStrategy())
    print(sorter.sort(data))

    sorter.setStrategy(new StrategyPattern.DescSortStrategy())
    print(sorter.sort(data))
})()
