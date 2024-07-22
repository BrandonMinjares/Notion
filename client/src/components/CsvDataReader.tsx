import React, { useState, useEffect } from 'react';

interface CsvRow {
  ID: string;
  Info: string;
}

const fetchCSVData = async (setData: React.Dispatch<React.SetStateAction<CsvRow[]>>) => {
  const response = await fetch('http://localhost:3001/data');
  const data = await response.json();
  setData(data);
};

const updateCSVData = async (data: CsvRow[]) => {
  await fetch('http://localhost:3001/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

const deleteCSVData = async (rowID: number) => {
    const id = rowID.toString()
    await fetch(`http://localhost:3001/data/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

export default function CsvDataReader() {
  const [data, setData] = useState<CsvRow[]>([]);
  const [editingCell, setEditingCell] = useState<{ row: number, column: string } | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  useEffect(() => {
    fetchCSVData(setData);
  }, []);

  const addRow = () => {
    const newRow: CsvRow = {
      ID: (data.length + 1).toString(),
      Info: 'Enter...',
    };
    const newData = [...data, newRow];
    setData(newData);
    updateCSVData(newData);
  };

  const deleteRow = async (row: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    try {
        await deleteCSVData(row);
        const newData = data.filter((_, index) => index !== row);
        setData(newData);
      } catch (error) {
        console.error('Error deleting row:', error);
      }
  };

  const handleCellClick = (row: number, column: string, value: string) => {
    setEditingCell({ row, column });
    setTempValue(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.value);
  };

  const handleBlur = (row: number, column: string) => {
    const newData = data.map((r, index) => {
      if (index === row) {
        return { ...r, [column]: tempValue };
      }
      return r;
    });
    setData(newData);
    setEditingCell(null);
    updateCSVData(newData);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, column: string) => {
    if (e.key === 'Enter') {
      handleBlur(row, column);
    }
  };

  return (
  <div>
    <h1>Notion</h1>
    <table>
        <thead>
            <tr>
            </tr>
        </thead>
        <tbody>
            {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row" onClick={() => handleCellClick(rowIndex, 'Info', row.Info)}>
                <td>
                {editingCell?.row === rowIndex && editingCell.column === 'Info' ? (
                    <input
                    type="text"
                    value={tempValue}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur(rowIndex, 'Info')}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 'Info')}
                    autoFocus
                    />
                ) : (
                    row.Info
                )}

                </td>
                <td><button onClick={(event) => deleteRow(rowIndex, event)}>delete</button></td>
            </tr>
            ))}
        </tbody>
    </table>
    <button onClick={(event) => addRow()}>Add Row</button>
    </div>
  );
}
