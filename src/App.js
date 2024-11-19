import {useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import {isFibonacci} from "./helpers/isFibonacci";
import {FibonacciModal} from "./components/FibonacciModal/FibonacciModal";
import {Cell} from "./components/Cell/Cell";
import {useFibonacciGrid} from "./hooks/useFibonacciGrid";
import {getCoordinate, getFlattenedCoordinates, getColorForFibValue} from "./helpers/gridHelpers";

const size = 50;

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
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const emojis = ['🔢', '🌿', '🌀'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const [score, setScore] = useState(0);
    // cache the result of rows and columns between re-renders so we don't have to recalculate

    const {rows, columns} = useFibonacciGrid(size)


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
        let seqScore = 0;

        seq.forEach((element) => {
            seqScore += element.value;
            delete fibsToCheck[element.coordinate] // remove processed to prevent re-processing in other directions

        })

        setTimeout(() => {
            setScore((prevScore) => prevScore + seqScore);
        }, 750)

        seqs.push(seq);
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

                if (seq.length === 5) {
                    seqs = removeAndStoreValidFibSequences(seqs, seq)
                }
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

                if (seq.length === 5) {
                    seqs = removeAndStoreValidFibSequences(seqs, seq)
                }
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

                if (seq.length === 5) {
                    seqs = removeAndStoreValidFibSequences(seqs, seq)
                }
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

                if (seq.length === 5) {
                    seqs = removeAndStoreValidFibSequences(seqs, seq)
                }
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

    const clearCells = (allFibs) => {
        const coordinates = getFlattenedCoordinates(allFibs);
        
        setTimeout(() => {
            const newMap = new Map(map);
            coordinates.forEach(coordinate => {
                newMap.delete(coordinate);
            });
            setMap(newMap);
            setReadyToClear(false);
        }, 500)
    }

    // todo make this into three functions
    const collectFibs = () => {
        let newFibColors = {};

        map.forEach((value, key) => {
            if (isFibonacci(value)) {
                fibsToCheck[key] = value;
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

    const handleStart = () => {
        setModalIsOpen(false)
    }

    return (
        <>
            {!modalIsOpen ?
                <>
                    <header>
                            <div className="score-display">
                                <h2>Score: {score}</h2>
                            </div>
                                <a className={"link"} href="https://github.com/michaelzon/fibonacci-game">View on
                                    GitHub</a>
                    </header>
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
                                            style={fibColors[coordinate] ? {backgroundColor: fibColors[coordinate]} : {
                                                color: "white",
                                                backgroundColor: 'transparent'
                                            }}
                                        >
                                            {map.get(coordinate) ? map.get(coordinate) : ''}
                                        </td>
                                        // <Cell col={col} incrementCells={incrementCells} row={row} map={map} coordinate={coordinate} fibColors={fibColors}/>

                                    )
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
                :
                <FibonacciModal modalIsOpen={modalIsOpen} emoji={emoji} handleStart={handleStart}/>
            }
        </>
    )
}

export default App;
