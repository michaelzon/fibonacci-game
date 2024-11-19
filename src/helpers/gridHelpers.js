import {colors} from "../constants/colors";

export const getColorForFibValue = (value) => {
    const index = Math.min(
        colors.length - 1,
        Math.floor(Math.log(value) / Math.log(2)) // Adjust the base to control granularity
    );
    return colors[index];
};

export const getCoordinate = (row, col) => `${row}:${col}`;

export const getFlattenedCoordinates = (allFibs) => {
    return allFibs.flat().flat().map(fib => fib.coordinate);
}