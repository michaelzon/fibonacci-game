import {isPerfectSquare} from "./isPerfectSquare";

export const isFibonacci = (n) => {
    return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
}
