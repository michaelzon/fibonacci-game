import {useMemo, useState} from "react";
import {getCoordinate} from "../helpers/gridHelpers";

export const useFibonacciGrid = (size, consecutiveFibThreshold, fibsToCheck) => {

    // cache the result of rows and columns between re-renders so we don't have to recalculate
    const rows = useMemo(() => Array.from(Array(size).keys()), [size]);
    const columns = useMemo(() => Array.from(Array(size).keys()), [size]);
    const [score, setScore] = useState(0);

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

    return {rows, columns, searchFibsLeftToRight, searchFibsRightToLeft, searchFibsTopToBottom, searchFibsBottomToTop, score}

}