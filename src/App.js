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
    const [fibColors, setFibColors] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const emojis = ['🔢', '🌿', '🌀'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

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

    const {rows, columns, searchFibsLeftToRight, searchFibsRightToLeft, searchFibsTopToBottom, searchFibsBottomToTop, score} = useFibonacciGrid(size, consecutiveFibThreshold, fibsToCheck)

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
