"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const app = (0, express_1.default)();
const port = 3001;
app.get('/', (req, res) => {
    res.send('Hello, world!');
    const results = [];
    fs_1.default.createReadStream('./data/data.csv')
        .pipe((0, csv_parser_1.default)())
        .on('data', (data) => results.push(data))
        .on('end', () => {
        console.log(results);
        // Now `results` is typed as an array of CsvRow objects
    });
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
