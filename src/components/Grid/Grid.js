import {getCoordinate} from "../../helpers/gridHelpers";

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
    )
}