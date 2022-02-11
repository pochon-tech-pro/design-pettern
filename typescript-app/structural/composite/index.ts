// ----------------
// Composite Pattern
// 単一のオブジェクトとその集合のどちらも同じように扱えるようにする
// WindowsのExploreにおけるfolderとfileの削除や作成といった操作は共通であ、folderの中身に構造は意識しない
// 特徴的なのは、オブジェクトを木構造に組み立てること
// ----------------

namespace CompositePattern {
    abstract class OrganizationEntry { // Component(Clientクラスに対して、共通にアクセスさせるためのAPIを提供)
        private readonly _code: string
        private readonly _name: string

        protected constructor(code: string, name: string) {
            this._code = code
            this._name = name
        }

        public getCode = () => this._code
        public getName = () => this._name

        public abstract add(other: OrganizationEntry): void // 再帰的な構造を作る

        public dump() {
            console.log(`${this._code} : ${this._name} (${this.constructor.name})`)
        }
    }

    export class Group extends OrganizationEntry { // Composite（木構造の任意の枝）
        private _entries: OrganizationEntry[] = []

        constructor(code: string, name: string) {
            super(code, name);
        }

        public add(other: OrganizationEntry): void {
            this._entries.push(other)
        }

        public dump() {
            super.dump();
            this._entries.forEach(item => item.dump())
        }
    }

    export class Employee extends OrganizationEntry { // Leaf（木構造の末端の葉）
        constructor(code: string, name: string) {
            super(code, name);
        }

        add(other: OrganizationEntry): void {
            throw new Error('BadMethodCall')
        }
    }
}


//---------------------
// Client
//---------------------
(() => {
    const root = new CompositePattern.Group("001", "本社")
    root.add(new CompositePattern.Employee("00101", "社長"))
    root.add(new CompositePattern.Employee("00102", "副社長"))

    const group1 = new CompositePattern.Group("010", "大阪支店")
    group1.add(new CompositePattern.Employee("01001", "大阪支店長"))
    group1.add(new CompositePattern.Employee("01002", "大阪副支店長"))
    const group1A = new CompositePattern.Group("110", "大阪営業所")
    group1.add(group1A)
    group1.add(new CompositePattern.Employee("11001", "大阪営業所長"))
    root.add(group1)

    const group2 = new CompositePattern.Group("020", "沖縄支店")
    group2.add(new CompositePattern.Employee("02001", "沖縄支店長"))
    group2.add(new CompositePattern.Employee("02002", "沖縄副支店長"))
    root.add(group2)

    root.dump()
})()



