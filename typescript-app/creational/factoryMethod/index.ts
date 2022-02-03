// ----------------
// FactoryMethodPattern
// クラスの継承を利用して生成されるオブジェクトを切り替える
// オブジェクトの生成処理と利用側を分離できる（疎結合化）
// ----------------

import fs from "fs";
import {parse} from 'csv-parse/sync';
import * as xml2js from "xml2js";

interface Reader { // Product
    display(): void
}

class CSVFileReader implements Reader { // ConcreteProduct
    private readonly filepath: string

    constructor(filename: string) {
        // TODO: Error Handling
        this.filepath = __dirname + filename;
    }

    public display(): void {
        const buffer = fs.readFileSync(this.filepath);
        const data = parse(buffer, {
            columns: false,
        });
        // CSVとXMLで分離されたので、ここではCSVの表示形式に集中できる
        console.log(data);
    }
}

class XMLFileReader implements Reader { // ConcreteProduct
    private readonly filepath: string

    constructor(filename: string) {
        // TODO: Error Handling
        this.filepath = __dirname + filename;
    }

    public display(): void {
        const buffer = fs.readFileSync(this.filepath);
        const data = this.syncParseXml(buffer);
        console.log(data);
    }

    private syncParseXml = (xml: Buffer) => {
        return new Promise((resolve, reject) => {
            const parser = new xml2js.Parser();
            parser.parseString(xml, (err: Error, result: any) => err ? reject(err) : resolve(result))
        });
    }
}

class ReaderFactory { // ConcreteCreator

    // Virtual Constructor
    public static create(filename: string): Reader {
        return ReaderFactory.createFileReader(filename);
    }

    private static createFileReader(filename: string): Reader {
        const extension = filename.split('.').pop();
        if (extension === 'csv') {
            return new CSVFileReader(filename);
        } else if (extension === 'xml') {
            return new XMLFileReader(filename);
        } else {
            throw new Error('想定外のFileです。')
        }
    }
}


// Client
const reader = ReaderFactory.create('/Sample.xml');
reader.display();
