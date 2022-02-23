// ----------------
// Mediator Pattern
// クラス同士の複雑なやりとりを仲介して、オブジェクト同士の結びつきをゆるくする
// 仲介者とクラスの関係を1:nにし、それぞれのクラスは他のクラスを知らずとも、仲介者さえ知っていればやりとりができる。
// 無線LANでいうインフラストラクチャモードに似ている（PC同士が直接通信（アドホック）するのではなく、アクセスポイント経由で通信するのでPCはアクセスポイントを知れば良い）
// ----------------
/**
 * Class
 * +------------------+ <----◇ +----------------+
 * |Mediator(Chatroom)|        |Colleague(User) |
 * +------------------+ ◇----> +----------------+
 */
namespace MediatorPattern {
    // Colleague: Mediatorクラスに通知をおこなうクラス。
    // ConcreteColleague: Colleagueのサブクラスで、内部にMediatorオブジェクトを所持している。
    //                    Mediatorオブジェクトを通じて他のConcreteColleagueクラスとやり取りする。
    export class User { // ColleagueおよびConcreteColleagueに相当
        private _chatroom?: Chatroom // Mediatorオブジェクトを保持
        private readonly _name: string

        constructor(name: string) {
            this._name = name
        }

        public setChatroom(chatroom: Chatroom) {
            this._chatroom = chatroom
        }

        public getName = () => this._name
        public getChatroom = () => this._name

        public sendMessage(to: User, msg: string) {
            this._chatroom?.sendMessage(this, to, msg)
        }

        public receiveMessage(from: User, msg: string) {
            console.log(`${from.getName()}から${this._name}のメッセージ：${msg}`)
        }
    }

    // Mediator: 仲介者のクラスで、Colleagueクラスから通知を受け取るメソッドを定義する ( |Mediator(Chatroom)|<----◇|Colleague(User)| )
    // ConcreteMediator: Mediatorのサブクラスで、Mediatorクラスで定義された実装を行う
    export class Chatroom { // MediatorおよびConcreteMediatorに相当し、"Userクラス同士のやり取り"を管理している
        private _users: User[]  = []
        public login(target: User) {
            target.setChatroom(this)
            // まだ入室していなければ入室
            if (this._users.find(user => user.getName() !== target.getName())) {
                this._users.push(target)
                console.log(`${target.getName()}が入室ました。`)
            }
        }
        public sendMessage(to: User, from: User, message: string) {
            if (this._users.find(user => user.getName() !== to.getName())) {
                console.log(`${to.getName()}というUserは入室していません。`)
            } else {
                to.receiveMessage(from, message)
            }
        }
    }
}

//---------------------
// Client
//---------------------
(() => {
    const room = new MediatorPattern.Chatroom()

    const A = new MediatorPattern.User("A")
    const B = new MediatorPattern.User("B")

    room.login(A)
    room.login(B)

    A.sendMessage(B, 'Hello')
    B.sendMessage(A, 'Ha !?')
})()
