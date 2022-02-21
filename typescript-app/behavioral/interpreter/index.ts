// ----------------
// interpreter Pattern
// 文法を解析し、その結果を利用して処理を行うことを目的としている
// 文法で定義されている規則をクラスとして表し、それに対する振る舞いを併せて定義する。この規則とは構文木における節や葉に相当。
//   構造木：例えば、「今日は晴れた」という文は主語・述語に分岐し、主語は名詞句・助詞、名詞句はさらに名詞と構文解析するみたいなこ木構造表現のこと
//
//
// ----------------

import * as disk from 'diskusage'

// Interpreterパターンの適用例として、簡単なミニ言語を作成
// <Job> ::= begin <CommandList>         // ...この言語はBeginという文字列で始まり、その間にコマンド一覧を並べる
// <CommandList> ::= <Command>* end      // ...コマンド一覧は、0個以上のコマンドで構成され、endで終わる
// <Command> ::= diskspace | date | line // ...コマンドは diskspace | date | line のいずれか
namespace InterpreterPattern {
    // Context: 構文木を処理するために必要な情報を保持するクラス
    // 現在構文木のどこを解析しているのか、解析対象となるコマンドや次に出るコマンドを管理する
    export class Context {
        private readonly _commands: string[]
        private _current_index: number = 0
        private max_index: number = 0

        constructor(command: string) {
            this._commands = command.split(' ')
            this.max_index = this._commands.length
        }

        public next(): Context {
            this._current_index++
            return this
        }

        public getCurrentCommand(): string | null {
            const target = this._commands[this._current_index]
            return target ? target : null
        }
    }

    // AbstractExpression: 構文木の要素に共通なAPIを定義。Clientから利用される
    interface Command {
        execute(context: Context): void
    }

    // NonTerminalExpression: AbstractExpressionクラスのサブクラスであり、構文木の節に相当する
    // 内部には、他の規則へのリンクを保持しており、AbstractExpressionクラスで定義されたメソッドを実装
    export class JobNonTerminalExpression implements Command { // 上述したBNF記法のJobに相当するクラス
        public execute(context: Context) {
            if (context.getCurrentCommand() !== 'begin') {
                throw new Error('beginから始めてください')
            }
            (new CommandListNonTerminalExpression()).execute(context.next()) // 他の規則へのリンク
        }
    }

    class CommandListNonTerminalExpression implements Command { // 上述したBNF記法のJobに相当するクラス
        public execute(context: Context) {
            while (true) {
                const currentCommand = context.getCurrentCommand()
                if (currentCommand === null) {
                    throw new Error('endで終わってください')
                } else if(currentCommand === 'end') {
                    break
                } else {
                    (new CommandTerminalExpression()).execute(context)
                }
                context.next()
            }
        }
    }

    // TerminalExpression: AbstractExpressionクラスのサブクラスで、構文木の葉に相当する末端
    class CommandTerminalExpression implements Command {
        public execute(context: Context) {
            const currentCommand = context.getCurrentCommand()
            if (currentCommand === 'diskspace') {
                const info = disk.checkSync('/')
                console.log(`Free: ${info.free}`)
                console.log(`Total: ${info.total}`)
                console.log(`available: ${info.available}`)
            } else if(currentCommand === 'date') {
                const date = new Date()
                console.log(`${date.getFullYear()} / ${date.getMonth()+1} / ${date.getDate()}`)
            } else if(currentCommand === 'line') {
                console.log('-----------------------------------')
            } else {
                throw new Error(`不正なコマンドです: ${currentCommand}`)
            }
        }
    }

}


//---------------------
// Client
//---------------------
(() => {
    const job = new InterpreterPattern.JobNonTerminalExpression()
    job.execute(new InterpreterPattern.Context('begin date line diskspace end'))
})()
