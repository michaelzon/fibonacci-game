import { useState} from 'react';
import './App.css';
import {FibonacciModal} from "./components/FibonacciModal/FibonacciModal";
import {useFibonacciGrid} from "./hooks/useFibonacciGrid";
import {Header} from "./components/Header/Header";
import {Grid} from "./components/Grid/Grid";
import {emoji} from "./constants/emoji";
import {size} from "./constants/size";
import {consecutiveFibThreshold} from "./constants/consecutiveFibThreshold";

function App() {
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const handleStart = () => setModalIsOpen(false)
    const {rows, columns, map, fibColors, score, incrementCells} = useFibonacciGrid(size, consecutiveFibThreshold)

    return (
        <div className={'container'}>
            {!modalIsOpen ?
                <>
                    <Header score={score}/>
                    <Grid rows={rows} columns={columns} map={map} fibColors={fibColors} incrementCells={incrementCells}/>

                </>
                :
                <FibonacciModal modalIsOpen={modalIsOpen} emoji={emoji} handleStart={handleStart}/>
            }
        </div>
    )
}

export default App;
