import express, { Request, Response } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import cors from 'cors';

interface CsvRow {
  NAME: string;
  AGE: string;
  // Add more fields as per your CSV structure
}

const app = express();
app.use(cors());

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

