import {useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import {isFibonacci} from "./helpers/isFibonacci";

const size = 48;

function App() {
    const [map, setMap] = useState(new Map());
    const [clickedRow, setClickedRow] = useState(null);
    const [clickedCol, setClickedCol] = useState(null);
    const [readyToClear, setReadyToClear] = useState(false);
    const consecutiveFibThreshold = 5;
    const allFibs = useRef([]);
    let fibsToCheck = useRef({});
    const [clearingCells, setClearingCells] = useState([]); // todo check if this could be ref
    const [fibColors, setFibColors] = useState({});

    // const colors = [
    //     "#e5708b", "#c45470", "#9c4359", "#9b2f40",
    //     "#6b8e7a", "#5f7d6a", "#d2aa5c", "#c1994c",
    //     "#317589", "#a3483a", "#f4c842"
    // ];

    // const colors = [
    //     "#d2aa5c", "#c1994c", "#b1883f", "#9d7733",
    //     "#ad8b52", "#967748", "#7f613f", "#6b5035", // additional
    //     "#6b8e7a", "#5f7d6a", "#536c5a", "#4a6050",
    //     "#4c715e", "#3f5e4d", "#355040", "#2a4133", // additional
    //     "#317589", "#2b6577", "#285a6a", "#1f4d5d",
    //     "#266575", "#1f5665", "#174956", "#123847", // additional
    //     "#8a4b73", "#7a4166", "#6b385a", "#5d2f4e",
    //     "#774061", "#6b3856", "#5e2f4a", "#502640",  // Additional Purples
    //     "#e5708b", "#c45470", "#9c4359", "#9b2f40",
    //     "#d66779", "#b45761", "#9a4a56", "#813d47",
    //     "#6f6158", "#5e5149", "#4e423c", "#3e332f"   // Grays/Browns for Neutral Tones
    // ];
    const colors = [
        "#d2aa5c", "#c1994c", "#b1883f", "#9d7733",
        "#6b8e7a", "#5f7d6a", "#536c5a", "#4a6050",
        "#317589", "#2b6577", "#285a6a", "#1f4d5d",
        "#e5708b", "#c45470", "#9c4359", "#9b2f40",
    ];

    const getColorForFibValue = (value) => {
        const index = Math.min(
            colors.length - 1,
            Math.floor(Math.log(value) / Math.log(2)) // Adjust the base to control granularity
        );
        return colors[index];
    };

    const getColorByPosition = (row) => {
        return colors[row % colors.length]; // Loop through rowColors for larger grids
    };

    // cache the result of rows and columns between re-renders so we don't have to recalculate
    const rows = useMemo(() => Array.from(Array(size).keys()), [size]);
    const columns = useMemo(() => Array.from(Array(size).keys()), [size]);

    const getCoordinate = (row, col) => `${row}:${col}`;

    const processFibonacciSequence = (seq, row, col) => {
        const coordinate = getCoordinate(row, col);

        if (coordinate in fibsToCheck) {
            const value = fibsToCheck[coordinate];

            // if seq has less than two add otherwise we don't have enough for comparison + a check to ensure that
            // each new value in the sequence is equal to the sum of the previous two values.
            if (seq.length < 2 || value === seq[seq.length - 1].value + seq[seq.length - 2].value) {
                seq.push({coordinate, value});
                return true;
            } else {
                return false; // Stop by returning false if the value doesn't follow the Fibonacci-like rule
            }
        }
        return false; // Or stop if the coordinate doesn't exist in fibsToCheck
    };

    const removeAndStoreValidFibSequences = (seqs, seq) => {
        if (seq.length === consecutiveFibThreshold) {
            seq.forEach((element) => {
                delete fibsToCheck[element.coordinate]
            })
            seqs.push(seq);
        }
        return seqs;
    }

    const searchFibsLeftToRight = () => {
        let seqs = [];

        for (let row = 0; row < size; row++) {
            for (let startCol = 0; startCol <= size - consecutiveFibThreshold; startCol++) {
                const seq = []; // Temporary sequence for current set of 5 coordinates

                for (let offset = 0; offset < consecutiveFibThreshold; offset++) {
                    const col = startCol + offset;

                    if (!processFibonacciSequence(seq, row, col)) {
                        break;
                    }
                }

                seqs = removeAndStoreValidFibSequences(seqs, seq)
            }
        }
        return seqs;
    };

    const searchFibsRightToLeft = () => {
        let seqs = [];

        for (let row = 0; row < size; row++) {
            for (let startCol = size - 1; startCol >= consecutiveFibThreshold - 1; startCol--) {
                const seq = [];

                for (let offset = 0; offset < consecutiveFibThreshold; offset++) {
                    const col = startCol - offset;

                    if (!processFibonacciSequence(seq, row, col)) {
                        break;
                    }
                }

                seqs = removeAndStoreValidFibSequences(seqs, seq)
            }
        }
        return seqs;
    };


    const searchFibsTopToBottom = () => {
        let seqs = [];

        for (let col = 0; col < size; col++) {
            for (let startRow = 0; startRow <= size - consecutiveFibThreshold; startRow++) {
                const seq = [];

                for (let offset = 0; offset < consecutiveFibThreshold; offset++) {
                    const row = startRow + offset;

                    if (!processFibonacciSequence(seq, row, col)) {
                        break;
                    }
                }

                seqs = removeAndStoreValidFibSequences(seqs, seq)
            }
        }
        return seqs;
    }

    const searchFibsBottomToTop = () => {
        let seqs = [];

        for (let col = 0; col < size; col++) {
            for (let startRow = size - 1; startRow >= consecutiveFibThreshold - 1; startRow--) {
                const seq = [];

                for (let offset = 0; offset < consecutiveFibThreshold; offset++) {
                    const row = startRow - offset;

                    if (!processFibonacciSequence(seq, row, col)) {
                        break;
                    }
                }

                seqs = removeAndStoreValidFibSequences(seqs, seq)
            }
        }
        return seqs;
    }

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

    const getFlattenedCoordinates = (allFibs) => {
        return allFibs.flat().flat().map(fib => fib.coordinate);
    }

    const clearCells = (allFibs) => {
        const coordinates = getFlattenedCoordinates(allFibs);
        // Set cells to be cleared, triggering the animation
        setClearingCells(coordinates);

        setTimeout(() => {
            const newMap = new Map(map);
            coordinates.forEach(coordinate => {
                newMap.delete(coordinate);
            });
            setMap(newMap);
            setClearingCells([]);
            setReadyToClear(false);
        }, 500)
    }


    // todo make this into three functions
    const collectFibs = () => {
        let newFibColors = {};

        map.forEach((value, key) => {
            if (isFibonacci(value)) {
                fibsToCheck[key] = value;

                // const row = key.substring(0, key.indexOf(":"));
                // newFibColors[key] = getColorByPosition(row);

                newFibColors[key] = getColorForFibValue(value);
            }
        });
        setFibColors(newFibColors);

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
                            const coordinate = getCoordinate(row, col);
                            return (
                                <td key={col}
                                    onClick={() => incrementCells(row, col, map)}
                                    className={`${clearingCells.includes(coordinate) ? 'clearing' : ''}`}
                                    style={fibColors[coordinate] ? { backgroundColor: fibColors[coordinate] } : { color: "black" , backgroundColor: 'transparent' }}
                                >
                                    {map.get(coordinate) ? map.get(coordinate) : ''}
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
