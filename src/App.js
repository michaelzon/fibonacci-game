import {useState, useEffect} from 'react';
import './App.css';
import {isFibonacci} from "./helpers/isFibonacci";

const size = 10;

function App() {
    const [map, setMap] = useState(new Map());
    const [clickedRow, setClickedRow] = useState(null);
    const [clickedCol, setClickedCol] = useState(null);
    const seqLength = 3;
    let fibonacciCount = 0;
    

    useEffect(() => {
        console.log('clickedCol', clickedCol)
        console.log('clickedRow', clickedRow)
        console.log('map', map)
        checkMapForFibonacciNumbers()
    }, [map])


    const cellsToCheck = {}

    const checkMapForFibonacciNumbers = () => {
        map.forEach((value, key) => {
            if (isFibonacci(value)) {
                fibonacciCount++
                cellsToCheck[key] = value;
                // console.log(`${value} (at key '${key}') is a Fibonacci number.`);
            } else {
                // console.log(`${value} (at key '${key}') is NOT a Fibonacci number.`);
            }
        })
        // console.log("Total Fibonacci numbers found:", fibonacciCount);
    };

    console.log('cells to check', cellsToCheck);

    const incrementCells = (row, col, map) => {

        setClickedRow(row);
        setClickedCol(col);

        const newMap = new Map(map);

        for (let y = 0; y < size; y++) {
            const key = `${row}:${y}`;
            const colVal = map.get(key);
            newMap.set(key, (colVal === undefined || isNaN(colVal)) ? 1 : colVal + 1)
        }

        for (let x = 0; x < size; x++) {
            const key = `${x}:${col}`;
            const rowVal = map.get(key);
            newMap.set(key, (rowVal === undefined || isNaN(rowVal)) ? 1 : rowVal + 1)
        }

        setMap(newMap)
    }

    const rows = Array.from(Array(size).keys());
    const columns = Array.from(Array(size).keys());

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th className='invisible'></th>
                    {columns.map((col) => (
                        <th key={col}>{col}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row) => (
                    <tr key={row}>
                        <td className='first'>{row}</td>
                        {columns.map((col) => {
                            return (
                                <td key={col}
                                    onClick={() => incrementCells(row, col, map)}>{map.get(`${row}:${col}`) ? map.get(`${row}:${col}`) : ''}</td>
                            )
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
            {/* <button onClick={() => geef()}> harry? </button> */}
        </>
    )
}

export default App;
