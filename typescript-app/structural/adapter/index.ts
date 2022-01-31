// ----------------
// AdapterPattern
// 異なるクラスをつなぎ合わせる。
// 既存コードを修正せずに再利用可能になる。
// 利用者側はAdapterの先の実装を意識しなくてよい。
// ----------------
import * as fs from 'fs';

class ShowFile
{
    private filename: string;
    private readonly filepath: string;

    public constructor(filename: string) {
        ShowFile.validate(filename);
        this.filename = filename;
        this.filepath = __dirname+'/'+filename;
    }

    private static validate(filename: string): boolean {
        try {
            fs.readFileSync(__dirname+'/'+filename);
            return true;
        } catch (error) {
            throw new Error(`Failed to Read ${filename}`);
        }
    }

    protected showPlain(): void {
        const buffer = fs.readFileSync(this.filepath);
        console.log(buffer.toString())
    }
}

interface DisplaySourceFile {
    display(): void;
}

class DisplayShowFile extends ShowFile implements DisplaySourceFile {
    constructor(filename: string) {
        super(filename);
    }

    display(): void {
        this.showPlain();
    }
}

// Client側はDisplaySourceFile Interfaceしか知らない想定。
// しかし処理としては、ShowFile.showPlainAnother()の内容を実行したい。
// 日本のコンセントがShowFileで米国のコンセントがDisplaySourceFileで、その中間がDisplayShowFileのイメージ。
const showFile = new DisplayShowFile('Hello.txt');
showFile.display();

