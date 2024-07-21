import express, { Request, Response } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import cors from 'cors';
const { stringify } = require('csv-stringify/sync');

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

app.delete('/data/:rowID', (req: Request, res: Response) => {
  console.log('tes')
  console.log('row is ' + req.params['rowID'])
  
  let results: CsvRow[] = [];

  const csvFilePath = './data/data.csv'

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        results.push(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed.');

        // Delete a specific row (for example, by index)
        const rowIndexToDelete = parseInt(req.params.rowID); // specify the index of the row to delete
        if (rowIndexToDelete >= 0 && rowIndexToDelete < results.length) {
            results.splice(rowIndexToDelete, 1);
        }

        // Convert the modified data back to CSV format
        const csvData = stringify(results, { header: true });
        // Save the modified CSV data back to the file
        fs.writeFile(csvFilePath, csvData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing the file:', err);
                return;
            }
            console.log('Row deleted and CSV file updated.');
        });
    });
    
/*
  const csvData = req.body.map((row: any) => Object.values(row).join(',')).join('\n');
  const csvHeaders = Object.keys(req.body[0]).join(',');

  fs.writeFile('./data/data.csv', `${csvHeaders}\n${csvData}`, (err) => {
    if (err) {
      return res.status(500).send('Error writing to CSV file');
    }
    res.send('CSV file updated successfully');
  });
  */
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

