// ----------------
// Decorator Pattern
// 基本となるものに対して機能を加えて装飾する
// 継承による機能拡張と異なる点
//   ある機能は追加したいがこの機能は追加したくない、その逆パターンも必要と言った時。
//   つまり、継承による静的な機能拡張（クラス作成時に責任が決まる）ではなく、動的に（実行時に柔軟に機能の追加や除外）機能拡張するところが異なる。
// オブジェクトを利用する側で機能の組み合わせパターンを柔軟に選択できるメリットがある。
// ----------------

namespace DecoratorPattern {
    // Component: "拡張される機能"を定義した抽象クラス
    interface Text {
        getText(): string

        setText(str: string): void
    }

    // ConcreteComponent: Componentの基本実装。飾り付けられてしまうクラス。
    export class PlainText implements Text {
        private _textString: string = ''

        getText(): string {
            return this._textString
        }

        setText(str: string): void {
            this._textString = str
        }
    }

    // Decorator: Componentを継承し、さらにメンバ変数にComponentを保持する抽象クラス
    abstract class TextDecorator implements Text {
        private _text: Text

        protected constructor(text: Text) {
            this._text = text
        }

        getText(): string {
            return this._text.getText()
        }

        setText(str: string): void {
            this._text.setText(str)
        }
    }

    // ConcreteDecorator: 機能の拡張(飾り付け)を行う
    export class UpperCaseText extends TextDecorator {
        constructor(text: Text) {
            super(text)
        }

        getText(): string {
            return super.getText().toUpperCase()
        }
    }
}


//---------------------
// Client
//---------------------
(() => {
    const input = 'hello world'
    const plainText = new DecoratorPattern.PlainText()
    plainText.setText(input)
    console.log('Plain:', plainText.getText())

    const decoType = 'UpperCase'
    if (decoType === 'UpperCase') {
        console.log('UpperCase:', (new DecoratorPattern.UpperCaseText(plainText).getText()))
    } else {
        throw new Error('invalid decoType')
    }
})()
