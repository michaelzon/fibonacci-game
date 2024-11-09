import {useEffect, useRef, useState} from 'react';
import './App.css';
import {isFibonacci} from "./helpers/isFibonacci";
import {clear} from "@testing-library/user-event/dist/clear";

const size = 50;

function App() {
    const [map, setMap] = useState(new Map());
    const [clickedRow, setClickedRow] = useState(null);
    const [clickedCol, setClickedCol] = useState(null);
    const [readyToClear, setReadyToClear] = useState(false);
    const consecutiveFibThreshold = 5;
    const allFibs = useRef([]);
    const rows = Array.from(Array(size).keys());
    const columns = Array.from(Array(size).keys());
    const fibsToCheck = {}

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
                            seq.push({coordinate, value});
                        } else {
                            break; // Stop if the value doesn't follow the Fibonacci-like rule
                        }

                    } else {
                        break // Stop if the coordinate doesn't exist in fibsToCheck
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
        const seqsRightToLeft = [];

        for (let row = 0; row < size; row++) {
            for (let startCol = size - 1; startCol >= consecutiveFibThreshold - 1; startCol--) {
                const seq = [];

                for (let offset = 0; offset < consecutiveFibThreshold; offset++) {
                    const col = startCol - offset;
                    const coordinate = `${row}:${col}`;

                    if (coordinate in fibsToCheck) {
                        const value = fibsToCheck[coordinate];
                        if (seq.length < 2 || value === seq[seq.length - 1].value + seq[seq.length - 2].value) {
                            seq.push({coordinate, value});
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }

                if (seq.length === consecutiveFibThreshold) {
                    seq.forEach((element) => {
                        delete fibsToCheck[element.coordinate]
                    })
                    seqsRightToLeft.push(seq);
                }
            }
        }
        return seqsRightToLeft;
    };

    const searchFibsTopToBottom = () => {
        const seqsTopToBottom = [];

        for (let col = 0; col < size; col++) {
            for (let startRow = 0; startRow <= size - consecutiveFibThreshold; startRow++) {
                const seq = [];

                for (let offset = 0; offset < consecutiveFibThreshold; offset++) {
                    const row = startRow + offset;
                    const coordinate = `${row}:${col}`;

                    if (coordinate in fibsToCheck) {
                        const value = fibsToCheck[coordinate];

                        if (seq.length < 2 || value === seq[seq.length - 1].value + seq[seq.length - 2].value) {
                            seq.push({coordinate, value});
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }

                if (seq.length === consecutiveFibThreshold) {
                    seq.forEach((element) => {
                        delete fibsToCheck[element.coordinate]
                    })
                    seqsTopToBottom.push(seq);
                }
            }
        }
        return seqsTopToBottom;
    };

    const searchFibsBottomToTop = () => {
        const seqsBottomToTop = [];

        for (let col = 0; col < size; col++) {
            for (let startRow = size - 1; startRow >= consecutiveFibThreshold - 1; startRow--) {
                const seq = [];

                for (let offset = 0; offset < consecutiveFibThreshold; offset++) {
                    const row = startRow - offset;
                    const coordinate = `${row}:${col}`;

                    if (coordinate in fibsToCheck) {
                        const value = fibsToCheck[coordinate];

                        if (seq.length < 2 || value === seq[seq.length - 1].value + seq[seq.length - 2].value) {
                            seq.push({coordinate, value});
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }

                if (seq.length === consecutiveFibThreshold) {
                    seq.forEach((element) => {
                        delete fibsToCheck[element.coordinate]
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

    const getCoordinates = (allFibs) => {
        return allFibs.flat().flat().map(fib => fib.coordinate);
    }

    const clearCells = (allFibs) => {
        const coordinates = getCoordinates(allFibs);
        const newMap = new Map(map);
        coordinates.forEach(coordinate => {
            newMap.delete(coordinate);
        })
        setMap(newMap);
        setReadyToClear(false);
    }

    const collectFibs = () => {
        map.forEach((value, key) => {
            if (isFibonacci(value)) {
                fibsToCheck[key] = value;
            }
        });

        allFibs.current = [
            searchFibsLeftToRight(),
            searchFibsRightToLeft(),
            searchFibsTopToBottom(),
            searchFibsBottomToTop()
        ];

        if (allFibs.current.flat().length > 0) {
            setTimeout(() => {
                setReadyToClear(true);
            }, 500)
        }
    };

    useEffect(() => {
        collectFibs();
    }, [map]);

    useEffect(() => {
        if (readyToClear) {
            clearCells(allFibs.current);
        }
    }, [readyToClear]);

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
