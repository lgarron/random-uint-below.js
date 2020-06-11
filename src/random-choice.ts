import { randomUIntBelow } from "./random-int";

// Inspired by https://reference.wolfram.com/language/ref/RandomChoice.html
// This library itself should be kept small, but a wrapper library may want to implement selecting multiple element without replacement as with replacement:
// https://reference.wolfram.com/language/ref/RandomSample.html
export function randomChoice<T>(arr: Array<T>): T {
  return arr[randomUIntBelow(arr.length)];
}
