import {useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import {isFibonacci} from "./helpers/isFibonacci";
import {Modal} from "./Modal";

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
        let seqScore = 0;

        seq.forEach((element) => {
            seqScore += element.value;
            delete fibsToCheck[element.coordinate] // remove processed to prevent re-processing in other directions

        })

        setTimeout(() => {
            setScore((prevScore) => prevScore + seqScore);
        }, 500)

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

    const getFlattenedCoordinates = (allFibs) => {
        return allFibs.flat().flat().map(fib => fib.coordinate);
    }

    const clearCells = (allFibs) => {

        const coordinates = getFlattenedCoordinates(allFibs);

        // Set cells to be cleared, triggering the animation //todo check of dit samen hangt met die keyframe
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

        console.log(allFibs)

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
                                            className={`${clearingCells.includes(coordinate) ? 'clearing' : ''}`}
                                            style={fibColors[coordinate] ? {backgroundColor: fibColors[coordinate]} : {
                                                color: "white",
                                                backgroundColor: 'transparent'
                                            }}
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
                :
                <Modal isOpen={modalIsOpen}>
                    <Modal.BigEmoji>{emoji}</Modal.BigEmoji>
                    <Modal.Header> {"Welcome to Fibonacci: The Grid Puzzle Game!"} </Modal.Header>
                    <Modal.Description> {`Get ready to dive into the strategic and mathematical world of Fibonacci!`} </Modal.Description>
                    <Modal.Body> {"In this strategic puzzle, your goal is to clear the grid by forming patterns of 5 consecutive Fibonacci numbers in a row or column. Start with a 50x50 grid and click a cell to increment its value by 1—along with all other cells in the same row and column. Empty cells become 1. Align Fibonacci numbers (e.g., 1, 1, 2, 3, 5), and those cells will clear, making space for new moves.\n" +
                        "\n" +
                        "Plan wisely, set up chain reactions, and aim for the highest score. Good luck!"} </Modal.Body>
                    <Modal.Footer handleClose={handleStart}> Start </Modal.Footer>
                </Modal>
            }
        </>
    )
}

export default App;
