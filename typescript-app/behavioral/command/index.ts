// ----------------
// Command Pattern
// 命令そのものをクラスとして表現するパターン
// 要求を送る（オブジェクトのメソッド呼び出し）時に複雑だったり多種な要求になるとメンテ性が悪くなるので、要求自身をクラスとしてまとめる
// ----------------

namespace CommandPattern {
    export class File { // Receiver（命令をどのように実行するかを知っているクラス）
        private readonly _name: string

        constructor(name: string) {
            this._name = name
        }

        public getName = (): string => this._name
        public decompress = (): void => console.log(`${this._name}を展開しました`)
        public compress = (): void => console.log(`${this._name}を圧縮しました`)
        public create = (): void => console.log(`${this._name}を作成しました`)
    }

    interface Command { // Command（命令を実行するためのAPI）
        execute(): void
    }

    // CompressCommand
    // Receiverを受け取り、executeでそれぞれの要求に対する処理を行う。
    // ただし、具体的な処理はReceiver側で行う（受け取ったReceiverのメソッドを呼び出す）
    export class TouchCommand implements Command {
        private readonly _file: File

        constructor(file: File) {
            this._file = file
        }

        execute(): void {
            this._file.create()
        }
    }

    export class CompressCommand implements Command {
        private readonly _file: File

        constructor(file: File) {
            this._file = file
        }

        execute(): void {
            this._file.compress()
        }
    }

    export class CopyCommand implements Command {
        private readonly _file: File

        constructor(file: File) {
            this._file = file
        }

        execute(): void {
            (new File(this._file.getName() + '@Copy')).create()
        }
    }

    // Invoker（命令実行の要求を出す）
    // 各Commandを保持するクラスであり、保持するCommandを実行する役割を持つ
    export class Queue {
        private _commands: Command[] = []

        public addCommand(command: Command): void {
            this._commands.push(command)
        }

        public run(): void {
            this._commands.forEach(command => command.execute())
            this._commands = []
        }
    }
}


//---------------------
// Client
//---------------------
(() => {
    const file = new CommandPattern.File("Sample.csv")

    const queue = new CommandPattern.Queue()
    queue.addCommand(new CommandPattern.TouchCommand(file))
    queue.addCommand(new CommandPattern.CompressCommand(file))
    queue.addCommand(new CommandPattern.CopyCommand(file))

    queue.run()
})()



