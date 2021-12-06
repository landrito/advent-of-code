import {program} from '../../../program';

function partOne([input]: Array<string>): number {
  let numbers = input.split(',').map(s => parseInt(s));
  return solution(numbers, 80);
}

function partTwo([input]: Array<string>): number {
  let numbers = input.split(',').map(s => parseInt(s));
  return solution(numbers, 256);
}

interface NumberCount {
  [n: number]: number
}

function solution(numbers: Array<number>, days: number): number {
  let counts: NumberCount = {};
  for (let i = 0; i <= 8; i++) {
    counts[i] = 0;
  }
  counts =
      numbers.reduce((counts, v) => ({...counts, [v]: counts[v] + 1}), counts);

  for (let i = 0; i < days; i++) {
    counts = Object.keys(counts).reduce(
        (nc, _, index) => ({
          ...nc,
          ...(index === 8     ? {8: counts[0]} :
                  index === 6 ? {6: counts[7] + counts[0]} :
                                {[index]: counts[index + 1]})
        }),
        {} as NumberCount)
  }
  return Object.values(counts).reduce((x, y) => x + y, 0)
}

program(partOne, partTwo);
