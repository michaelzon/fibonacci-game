import {useEffect, useState} from 'react';
import './App.css';
import {isFibonacci} from "./helpers/isFibonacci";

const fibos = [0,
    1,
    1,
    2,
    3,
    5,
    8,
    13,
    21,
    34,
    55,
    89,
    144,
    233,
    377,
    610,
    987,
    1597,
    2584,
    4181]

const listOfFibs = [{"6:0": 6}, {"5:0": 5}, {"6:0": 6}]


const size = 12;

function App() {
    const [map, setMap] = useState(new Map());
    const [clickedRow, setClickedRow] = useState(null);
    const [clickedCol, setClickedCol] = useState(null);
    const sequenceLength = 5;
    let fibonacciCount = 0;


    useEffect(() => {
        collectFibs()
        searchFibNeighboursHorizontally()
    }, [map])


    const fibsToCheck = {}

    const collectFibs = () => {
        map.forEach((value, key) => {
            if (isFibonacci(value)) {
                fibsToCheck[key] = value;
            }
        })
    };

    const sortCoordinates = () => {
        const keys = Object.keys(fibsToCheck);
        return keys.toSorted((a, b) => {
            const [rowA, colA] = a.split(":").map(Number);
            const [rowB, colB] = b.split(":").map(Number);
            if (rowA !== rowB) {
                return rowA - rowB
            }
            return colA - colB;
        });
    }


    const sequences = [];

    const fiboInRowsToBeChecked = [];
    console.log('fiboInRowsToBeChecked', fiboInRowsToBeChecked)

    // ze zijn hier eerst voor row en dan voor column gesorteerd 0:0 0:5 0:6
    const searchFibNeighboursHorizontally = () => {
        const coordinates = sortCoordinates();
        for (let i = 0; i < coordinates.length; i++) {
            console.log(coordinates[i])
        }
        // for (let col = 0; col < size; col++) {
        //     const fibo = fibsToCheck[`0:${col}`];
        //
        //     fiboInRowsToBeChecked.push(fibo)
        // }

        // sequences.push(keysSorted.slice(i, i + sequenceLength))
        // for (let j = 0; j < sequenceLength; j++) {
        //     const key = keysSorted[i + j];
        // const rowIndex = parseInt(Array.from(key)[0]);
        // const colIndex = parseInt(key.slice(-1));
        // console.log('key 1', key);
        // console.log('key 2', rowIndex, colIndex);
        // console.log('value', fibsToCheck[keysSorted[i + j]]);
        // sequence.push({key: keysSorted[i + j], value: fibsToCheck[keysSorted[i + j]]});
    }
    // sequences.push(sequence)
    // }

    // const rowIndex = parseInt(Array.from(key)[0]);
    // const colIndex = parseInt(key.slice(-1));
    // const rowIndex = Array.from(key)[0];
    // const colIndex = key.slice(-1);
    // console.log('rowIndex', rowIndex)
    // console.log('colIndex', colIndex)
    // console.log('key', key);
    // console.log('value', value);
    // const keys = Object.keys(fibsToCheck);
    // console.log(keys);

    console.log('sequences', sequences)

    const incrementCells = (row, col, map) => {

        setClickedRow(row);
        setClickedCol(col);

        const newMap = new Map(map);

        for (let x = 0; x < size; x++) {
            const key = `${row}:${x}`;
            const colVal = map.get(key);
            newMap.set(key, (colVal === undefined || isNaN(colVal)) ? 1 : colVal + 1)
        }

        for (let y = 0; y < size; y++) {
            const key = `${y}:${col}`;
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
                                    onClick={() => incrementCells(row, col, map)}>{map.get(`${row}:${col}`) ? map.get(`${row}:${col}`) : ''}
                                </td>
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
