import {useEffect, useState} from 'react';
import './App.css';
import {isFibonacci} from "./helpers/isFibonacci";

const size = 20;

function App() {
    const [map, setMap] = useState(new Map());
    const [clickedRow, setClickedRow] = useState(null);
    const [clickedCol, setClickedCol] = useState(null);
    const consecutiveFibThreshold = 5;

    useEffect(() => {
        collectFibs()
        // const seqsLeftToRight = searchFibsLeftToRight() // todo elke keer nieuwe grid opbouwen na checken en dan verwijderen van cellen? Want als je straks zes fibs achter elkaar hebt, heb je een probleem.
        // console.log("seqs left to right", seqsLeftToRight)
        // const seqsRightToLeft = searchFibsRightToLeft()
        // console.log("seqs right to left", seqsRightToLeft)
        // const seqsTopToBottom = searchFibsTopToBottom();
        // console.log("seqs top to bottom", seqsTopToBottom);
        // const seqsBottomToTop = searchFibsBottomToTop();
        // console.log("seqs bottom to top", seqsBottomToTop);

        const allFibs = [
            searchFibsLeftToRight(),
            searchFibsRightToLeft(),
            searchFibsTopToBottom(),
            searchFibsBottomToTop()
        ];
        console.log('all fibs', allFibs)

    }, [map]);


    const getCoordinates = (allFibs) => {
        return allFibs.flat().flat().map(fib => fib.coordinate);

    }

    const clearCells = (allFibs) => {
        const coordinates = getCoordinates(allFibs);
        console.log('cooords', coordinates);
    }

    const fibsToCheck = {}

    // hier gaat ie over elke cell heen en verzamelt waardes dat fibonacci getallen zijn.
    const collectFibs = () => {
        map.forEach((value, key) => {
            if (isFibonacci(value)) {
                fibsToCheck[key] = value;
            }
        })
    };

    // todo dit gebruik ik niet meer???
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

    const searchFibsLeftToRight = () => {
        const seqsLeftToRight = [];

        for (let row = 0; row < size; row++) {
            for (let startCol = 0; startCol <= size - consecutiveFibThreshold; startCol++) {
                const seq = []; // Temporary sequence for current set of 5 coordinates

                for (let offset = 0; offset < consecutiveFibThreshold; offset++) {
                    const col = startCol + offset;
                    const coordinate = `${row}:${col}`;

                    if (coordinate in fibsToCheck) {
                        const value = fibsToCheck[coordinate];
                        // if seq has less than two add otherwise we don't have enough for comparison
                        if (seq.length < 2 || value === seq[seq.length - 1].value + seq[seq.length - 2].value) {
                            seq.push({ coordinate, value });
                        } else {
                            break; // Stop   if the value doesn't follow the Fibonacci-like rule
                        }

                    } else {
                        break
                    }

                    if (seq.length === consecutiveFibThreshold) {
                        seq.forEach((element) => {
                            delete fibsToCheck[element.coordinate] // we don't want elements be checked twice by searchers for other directions or remove more than the specified length
                        })
                        seqsLeftToRight.push(seq);
                    }
                }
            }
        }
        return seqsLeftToRight;
    };

    const searchFibsRightToLeft = () => {
        const seqsRightToLeft = []; // To store all found sequences

        for (let row = 0; row < size; row++) {
            for (let startCol = size - 1; startCol >= consecutiveFibThreshold - 1; startCol--) {
                const seq = []; // Temporary sequence for current set of 5 coordinates

                for (let offset = 0; offset < consecutiveFibThreshold; offset++) {
                    const col = startCol - offset;
                    const coordinate = `${row}:${col}`;

                    if (coordinate in fibsToCheck) {
                        const value = fibsToCheck[coordinate];
                        if (seq.length < 2 || value === seq[seq.length - 1].value + seq[seq.length - 2].value) {
                            seq.push({ coordinate, value });
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }

                if (seq.length === consecutiveFibThreshold) {
                    seq.forEach((element) => {
                        delete fibsToCheck[element.coordinate] // we don't want elements be checked twice by searchers for other directions or remove more than the specified length
                    })
                    seqsRightToLeft.push(seq);
                }
            }
        }
        return seqsRightToLeft;
    };

    const searchFibsTopToBottom = () => {
        const seqsTopToBottom = []; // To store all found sequences

        for (let col = 0; col < size; col++) {
            for (let startRow = 0; startRow <= size - consecutiveFibThreshold; startRow++) {
                const seq = []; // Temporary sequence for current set of 5 coordinatedinates

                for (let offset = 0; offset < consecutiveFibThreshold; offset++) {
                    const row = startRow + offset;
                    const coordinate = `${row}:${col}`;

                    if (coordinate in fibsToCheck) {
                        const value = fibsToCheck[coordinate];

                        if (seq.length < 2 || value === seq[seq.length - 1].value + seq[seq.length - 2].value) {
                            seq.push({ coordinate, value });
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }

                if (seq.length === consecutiveFibThreshold) {
                    seq.forEach((element) => {
                        delete fibsToCheck[element.coordinate] // we don't want elements be checked twice by searchers for other directions or remove more than the specified length
                    })
                    seqsTopToBottom.push(seq);
                }
            }
        }
        return seqsTopToBottom;
    };

    const searchFibsBottomToTop = () => {
        const seqsBottomToTop = []; // To store all found sequences

        for (let col = 0; col < size; col++) {
            for (let startRow = size - 1; startRow >= consecutiveFibThreshold - 1; startRow--) {
                const seq = []; // Temporary sequence for current set of 5 coordinates

                for (let offset = 0; offset < consecutiveFibThreshold; offset++) {
                    const row = startRow - offset;
                    const coordinate = `${row}:${col}`;

                    if (coordinate in fibsToCheck) {
                        const value = fibsToCheck[coordinate];

                        if (seq.length < 2 || value === seq[seq.length - 1].value + seq[seq.length - 2].value) {
                            seq.push({ coordinate, value });
                        } else {
                            break;
                        }
                    } else {
                        break; // Stop if the coordinate doesn't exist in fibsToCheck
                    }
                }

                if (seq.length === consecutiveFibThreshold) {
                    seq.forEach((element) => {
                        delete fibsToCheck[element.coordinate] // we don't want elements be checked twice by searchers for other directions or remove more than the specified length
                    })
                    seqsBottomToTop.push(seq);
                }
            }
        }
        return seqsBottomToTop;
    };

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
        </>
    )
}

export default App;
