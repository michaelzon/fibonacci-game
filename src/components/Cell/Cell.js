
export const Cell = ({col, incrementCells, row, map, clearingCells, fibColors}) => {
    const getCoordinate = (row, col) => `${row}:${col}`;

    const coordinate = getCoordinate(row, col);

    return (
        <td
            onClick={() => incrementCells(row, col, map)}
            className={`${clearingCells.includes(coordinate) ? 'clearing' : ''}`}
            style={fibColors[coordinate] ? {backgroundColor: fibColors[coordinate]} : {
                color: "white",
                backgroundColor: 'transparent'
            }}
        >
           {map.get(coordinate) ? map.get(coordinate) : ''}
        </td>
    );
}