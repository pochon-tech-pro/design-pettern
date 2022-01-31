// ----------------
// TemplateMethodPattern
// 共通処理をまとめられる。
// サブラクスにより、具体的な処理内容を変更できる。
// ----------------
abstract class AbstractDisplay // AbstractClass
{
    protected data: string[];

    public constructor(...data: string[]) {
        this.data = data;
    }

    public display() { // TemplateMethod
        this.displayHeader();
        this.displayBody();
        this.displayFooter();
    }

    protected abstract displayHeader(): void;

    protected abstract displayBody(): void;

    protected abstract displayFooter(): void;
}

class ListDisplay extends AbstractDisplay // ConcreteClass
{
    protected displayHeader(): void {
        console.log("<dl>");
    }

    protected displayBody(): void {
        this.data.forEach((item, idx) => {
            console.log(`<dt> ${idx} </dt>`);
            console.log(`<dd> ${item} </dd>`);
        });
    }

    protected displayFooter(): void {
        console.log("</dl>");
    }
}


class TableDisplay extends AbstractDisplay // ConcreteClass
{
    protected displayHeader(): void {
        console.log("<table>");
    }

    protected displayBody(): void {
        this.data.forEach((item, idx) => {
            console.log("<tr>");
            console.log(`<th> ${idx} </th>`);
            console.log(`<td> ${item} </td>`);
            console.log("</tr>");
        });
    }

    protected displayFooter(): void {
        console.log("</table>");
    }
}

// yarn ts-node behavioral/templateMethod/index.ts
const inputs = ['山田太郎', '田中太郎', '佐藤太郎'];
// サブクラスの型はその親クラスの型と置換可能（リスコフの置換原則）
const listDisplay: AbstractDisplay = new ListDisplay(...inputs);
const tableDisplay: AbstractDisplay = new TableDisplay(...inputs);

listDisplay.display();
tableDisplay.display();