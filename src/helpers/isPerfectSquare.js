export const isPerfectSquare = (x) => {
    let s = Math.floor(Math.sqrt(x));
    return s * s === x;
}