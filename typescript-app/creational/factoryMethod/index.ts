import * as fs from "fs";
import {parse} from 'csv-parse/sync';

import * as xml2js from "xml2js";

const filePath = __dirname + '/Sample.csv';
const buffer = fs.readFileSync(filePath);
const data = parse(buffer, {
    columns: false,
});
console.log(data);

(async () => {
    const xmlFilePath = __dirname + '/Sample.xml';
    const xmlBuffer = fs.readFileSync(xmlFilePath);
    const parser = new xml2js.Parser();
    const data = await parser.parseStringPromise(xmlBuffer);
    console.log(data);
})();

// -----------------------------------------
// Syncで使えるようにPromiseでラップした。
// -----------------------------------------
const syncParseXml = (xml: Buffer) => {
    return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(xml, (err: Error, result: any) => err ? reject(err) : resolve(result))
    });
}
const xmlFilePath = __dirname + '/Sample.xml';
const xmlBuffer = fs.readFileSync(xmlFilePath);
const jsonData = syncParseXml(xmlBuffer);
console.log(jsonData);