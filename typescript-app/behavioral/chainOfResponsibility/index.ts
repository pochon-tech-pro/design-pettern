// ----------------
// Chain of Responsibility Pattern
// 自分の責任で対処する必要かどうか判断し、無理なら他に任せるパターン。（処理を依頼する側と実際に処理を行う側を分離するパターン）
// 例えば検証処理でマッチ判定を実装する時にIF文だと、どの場合にどう処理するかを1箇所にまとまってしまい、
// 条件と対応の処理の組み合わせを知る必要があり複雑になると分岐の数が増え見通しが悪くなるので、分離したい。
// ClientはHandlerを呼び出し、Handlerは要求を処理するためのAPIを定義し、内部にHandler型のオブジェクトを保持し、責任Checkして処理を依頼する
// ----------------

namespace ChainOfResponsibilityPattern {
    abstract class ValidationHandler { // Handler
        private _nextHandler: ValidationHandler | null

        public constructor() {
            this._nextHandler = null
        }

        public setHandler(handler: ValidationHandler) {
            this._nextHandler = handler
        }

        public nextHandler(): ValidationHandler | null {
            return this._nextHandler
        }

        public validate(input: string): boolean | string { // Chainの実行
            const result = this.execValidation(input)
            if (!result) {
                return this.getErrorMessage()
            } else if (this.nextHandler() !== null) {
                return this.nextHandler()!.validate(input) // !. non-null assertion operator
            } else {
                return true // 全ての処理が成功したらTrueを返す
            }
        }

        protected abstract execValidation(input: string): boolean // 自クラスが担当する処理を実行
        protected abstract getErrorMessage(): string
    }

    export class NotEmptyValidationHandler extends ValidationHandler {
        protected execValidation(input: string): boolean {
            return input !== '';
        }

        protected getErrorMessage(): string {
            return "何かしら文字を含めてください";
        }
    }

    export class AlphabetValidationHandler extends ValidationHandler {
        protected execValidation(input: string): boolean {
            return /[a-zA-Z]/.test(input)
        }

        protected getErrorMessage(): string {
            return "半角英字を含めてください";
        }
    }

    export class NumberValidationHandler extends ValidationHandler {
        protected execValidation(input: string): boolean {
            return /[0-9]/.test(input)
        }

        protected getErrorMessage(): string {
            return "半角数字を含めてください";
        }
    }
}


//---------------------
// Client
//---------------------
(() => {

    const init = () => {
        const rule1 = new ChainOfResponsibilityPattern.NotEmptyValidationHandler()
        const rule2 = new ChainOfResponsibilityPattern.NumberValidationHandler()
        const rule3 = new ChainOfResponsibilityPattern.AlphabetValidationHandler()

        rule1.setHandler(rule2)
        rule2.setHandler(rule3)

        return rule1
    }

    const ruleSet = init()
    console.log(ruleSet.validate(''))
    console.log(ruleSet.validate('a'))
    console.log(ruleSet.validate('0'))
    console.log(ruleSet.validate('0a'))
})()



