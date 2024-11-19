import {useMemo} from "react";

export const useFibonacciGrid = (size) => {
    const rows = useMemo(() => Array.from(Array(size).keys()), [size]);
    const columns = useMemo(() => Array.from(Array(size).keys()), [size]);

    return {rows, columns}
}