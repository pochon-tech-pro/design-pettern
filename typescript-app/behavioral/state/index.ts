// ----------------
// State Pattern
// ものではなく"状態"をクラスとして表現し、"状態"ごとに振る舞いを切り替えられるようにする
// 具体的な状態をConcreteStateとして定義し、IStateの共通なAPIを実装し、状態クラスは「どの状態か」を意識することなくアクセスできるようにする。
// Clientからアクセスさせるための処理クラスContextを用意し、その内部にはConcreteStateのインスタンスを保持するように構成する
// ----------------

// ログインした時だけカウンタ機能へのリンクが表示される例。状態としてはログイン・ログアウトの2つ。
namespace StatePattern {

    // Context: State型のオブジェクトを内部に保持する。 具体的な処理をそのオブジェクトに委譲する。
    // これにより、ConcreteStateクラスに依存するこがなくなり、状態を切り替えることができる。
    export class UserContext { // Context
        private _name: string
        private _state: UserState

        constructor(name: string) {
            this._name = name
            this._state = UnAuthorizedState.getInstance()
        }

        public switchState() {
            const prev = this._state
            this._state = this._state.nextState()
            console.log(`状態が、${prev.name}から${this._state.name}に切り替わりました。`)
        }

        public isAuthenticated() {
            return this._state.isAuthenticated()
        }

        public getMenu() {
            return this._state.getMenu()
        }
    }

    // State: それぞれの状態に共通のAPIを定義する。
    interface UserState {
        isAuthenticated(): boolean // 認証済みかどうかの確認
        nextState(): UserState     // 次の状態に切り替える（認証済みかそうでないかの二択なのでToggle的なイメージ)
        getMenu(): string          // 状態ごとに利用可能な機能一覧表示
        name: string               // 状態名
    }

    class AuthorizedState implements UserState {
        private static _singleton: AuthorizedState = new AuthorizedState()
        private constructor() {}
        public static getInstance = (): AuthorizedState => this._singleton

        public getMenu = (): string => "1: go count up. 2: go logout."
        public isAuthenticated = (): boolean => true
        public nextState = (): UnAuthorizedState => UnAuthorizedState.getInstance()
        public name: string = 'ログイン済'
    }

    class UnAuthorizedState implements UserState {
        private static _singleton: UnAuthorizedState = new UnAuthorizedState()
        private constructor() {}
        public static getInstance = (): UnAuthorizedState => this._singleton

        public getMenu = (): string => "1: go login."
        public isAuthenticated = (): boolean => false
        public nextState = (): AuthorizedState => AuthorizedState.getInstance()
        public name: string = '未ログイン'
    }

}

//---------------------
// Client
//---------------------
(() => {
    // 注目すべきは、このClient側のコードには、状態に関するコード一切でなくなる。つまり、ログイン時はXXみたいなIF文が消える。
    const context = new StatePattern.UserContext('太郎')

    console.log(context.isAuthenticated())
    console.log(context.getMenu())
    context.switchState()
    console.log(context.isAuthenticated())
    console.log(context.getMenu())
})()
