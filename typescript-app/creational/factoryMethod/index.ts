import * as fs from "fs";
import {parse} from 'csv-parse/sync';

const filePath = __dirname + '/Sample.csv';
const buffer = fs.readFileSync(filePath);
const data = parse(buffer, {
    columns: false,
});
console.log(data);
