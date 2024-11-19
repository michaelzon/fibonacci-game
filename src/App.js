import {useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import {isFibonacci} from "./helpers/isFibonacci";
import {FibonacciModal} from "./components/FibonacciModal/FibonacciModal";
import {Cell} from "./components/Cell/Cell";
import {useFibonacciGrid} from "./hooks/useFibonacciGrid";
import { getCoordinate } from "./helpers/gridHelpers";
import {Header} from "./components/Header";
import {Grid} from "./components/Grid/Grid";

const size = 50;


function App() {
    const consecutiveFibThreshold = 5;
    let fibsToCheck = useRef({});
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const emojis = ['🔢', '🌿', '🌀'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const handleStart = () => {
        setModalIsOpen(false)
    }

    const {rows, columns, map, fibColors, score, incrementCells} = useFibonacciGrid(size, consecutiveFibThreshold, fibsToCheck)

    return (
        <>
            {!modalIsOpen ?
                <>
                    <Header score={score}/>
                    <Grid rows={rows} columns={columns} map={map} fibColors={fibColors} incrementCells={incrementCells}/>

                </>
                :
                <FibonacciModal modalIsOpen={modalIsOpen} emoji={emoji} handleStart={handleStart}/>
            }
        </>
    )
}

export default App;
