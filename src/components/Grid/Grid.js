import {Cell} from "./Cell/Cell";
import './Grid.css';

export const Grid = ({columns, rows, incrementCells, fibColors, map}) => {
    return (
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
                    {columns.map((col) => <Cell col={col} row={row} map={map} incrementCells={incrementCells} fibColors={fibColors}/>)}
                </tr>
            ))}
            </tbody>
        </table>
    )
}