// ----------------
// Visitor Pattern
// データ構造から分離された操作が、データ構造を渡り歩き順に処理を行う。
// データ構造上の要素とそれに対する操作を分離する設計パターン。
// Visitorパターンは、データ構造を表すクラス階層と操作を表すクラス階層から構成される。
//   データ構造のクラス階層は、データ構造を表す関連やメソッドが用意され、訪問者を受け入れるためのメソッドが別に用意される。
//   訪問者である操作のクラス階層は、データ構造上の各要素に対する処理が実装される。操作クラスがデータ構造クラスに受け入れられると、訪問者の操作クラスは操作を依頼。
// 追記：Visitorパターンの特徴として、ダブルディスパッチがあげられる。
//   ダブルディスパッチ: 2つの型(ConcreteVisitorとConcreteElement)のVisitor.visitとElement.acceptよって実行処理が確定すること。
// ----------------

namespace VisitorPattern {

    // Element: データ構造のクラス階層。Visitor型んオブジェクトを受け入れるメソッド"accept"を持つ。
    abstract class OrganizationEntry {
        private readonly _code: string
        private readonly _name: string
        public code = () => this._code
        public name = () => this._name

        protected constructor(code: string, name: string) {
            this._code = code
            this._name = name
        }

        public abstract add(entry: OrganizationEntry): void

        public abstract getChildren(): OrganizationEntry[]

        public accept(visitor: Visitor) {
            visitor.visit(this)
        }
    }

    // ConcreteElement: Elementのサブクラス。"accept"の実装を行う（今回はDefault実装で親側でやってる）
    export class Group extends OrganizationEntry {
        private _entries: OrganizationEntry[] = []

        constructor(code: string, name: string) {
            super(code, name)
        }

        add = (entry: OrganizationEntry): void => void this._entries.push(entry)

        getChildren = (): OrganizationEntry[] => this._entries
    }

    // ConcreteElement: Elementのサブクラス。"accept"の実装を行う（今回はDefault実装で親側でやってる）
    export class Employee extends OrganizationEntry {
        constructor(code: string, name: string) {
            super(code, name)
        }

        add = (_: OrganizationEntry): void => {
            throw new Error('not access method')
        }

        getChildren = (): OrganizationEntry[] => []
    }

    // Visitor: 操作のクラス階層。データ構造のConcreteElementを処理するためのメソッドを定義する。
    interface Visitor {
        visit(entry: OrganizationEntry): void
    }

    // ConcreteVisitor: Visitorクラスのサブクラス。
    export class DumpVisitor implements Visitor {
        public visit(entry: OrganizationEntry): void {
            if (entry.constructor.name === 'Group') {
                console.log(`【Group】 Code: ${entry.code()}. Name: ${entry.name()}`)
            } else {
                console.log(`【Employee】 Code: ${entry.code()}. Name: ${entry.name()}`)
            }

            // ぶら下がらる組織や従業員に対しても訪問していく（受け止めてもらう）
            entry.getChildren().forEach(each => each.accept(this))
        }
    }

    // ConcreteVisitor: Visitorクラスのサブクラス。
    export class CountVisitor implements Visitor {
        private _groupCount = 0
        private _employeeCount = 0
        public groupCount = () => this._groupCount
        public employeeCount = () => this._employeeCount

        public visit(entry: OrganizationEntry): void {
            if (entry.constructor.name === 'Group') {
                this._groupCount++
            } else {
                this._employeeCount++
            }

            // ぶら下がらる組織や従業員に対しても訪問していく（受け止めてもらう）
            entry.getChildren().forEach(each => each.accept(this))
        }
    }
}

//---------------------
// Client
//---------------------
(() => {
    const root = new VisitorPattern.Group("001", "本社")
    root.add(new VisitorPattern.Employee("00101", "社長"))
    root.add(new VisitorPattern.Employee("00102", "副社長"))

    const group1 = new VisitorPattern.Group("010", "大阪支店")
    group1.add(new VisitorPattern.Employee("01001", "大阪支店長"))
    group1.add(new VisitorPattern.Employee("01002", "大阪副支店長"))
    const group1A = new VisitorPattern.Group("110", "大阪営業所")
    group1.add(group1A)
    group1.add(new VisitorPattern.Employee("11001", "大阪営業所長"))
    root.add(group1)

    const group2 = new VisitorPattern.Group("020", "沖縄支店")
    group2.add(new VisitorPattern.Employee("02001", "沖縄支店長"))
    group2.add(new VisitorPattern.Employee("02002", "沖縄副支店長"))
    root.add(group2)

    // 表示処理クラス
    const dumpVisitor = new VisitorPattern.DumpVisitor()
    root.accept(dumpVisitor)

    // グループ・従業員集計クラス
    const countVisitor = new VisitorPattern.CountVisitor()
    root.accept(countVisitor)
    console.log(`グループ数： ${countVisitor.groupCount()}`)
    console.log(`従業員数： ${countVisitor.employeeCount()}`)
})()
