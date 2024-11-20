import {getCoordinate} from "../../../helpers/gridHelpers";

export const Cell = ({col, row, map, incrementCells, fibColors}) => {
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
    );
}