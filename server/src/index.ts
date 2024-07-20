import express, { Request, Response } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import cors from 'cors';

interface CsvRow {
  ID: string,
  Info: string
  // Add more fields as per your CSV structure
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const port = 3001;

app.get('/data', (req: Request, res: Response) => {
  const results: CsvRow[] = [];

  fs.createReadStream('./data/data.csv')
  .pipe(csv())
  .on('data', (data: CsvRow) => results.push(data))
  .on('end', () => {
    res.send(results);
    // Now `results` is typed as an array of CsvRow objects
  });
});

app.post('/data', (req: Request, res: Response) => {

  const csvData = req.body.map((row: any) => Object.values(row).join(',')).join('\n');
  const csvHeaders = Object.keys(req.body[0]).join(',');

  fs.writeFile('./data/data.csv', `${csvHeaders}\n${csvData}`, (err) => {
    if (err) {
      return res.status(500).send('Error writing to CSV file');
    }
    res.send('CSV file updated successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

