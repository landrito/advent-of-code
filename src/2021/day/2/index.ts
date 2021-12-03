import {Command} from 'commander';

import {read} from '../../../input-helpers';

function main() {
  const program = new Command();
  program.option('-f, --file <filename>', 'Input file');
  program.parse(process.argv);
  const lines = read(program.opts().file);
  console.log(partOne(lines));
  console.log(partOneRec(lines));
  console.log(partTwo(lines));
}
main();

interface Vector2D {
  x: number, y: number,
}

function partOne(lines: Array<string>): number {
  const {x, y} = lines.map(lineToVector).reduce(sum, {x: 0, y: 0});
  return x * y
}

function partOneRec(lines: Array<string>): number {
  const vectors = lines.map(lineToVector);
  const helper =
      (vectors: Array<Vector2D>, {x, y}: Vector2D = {x: 0, y: 0}): Vector2D => {
        if (vectors.length === 0) {
          return {x, y};
        }
        const [{x: curX, y: curY}, ...rest] = vectors;
        return helper(rest, {x: x + curX, y: y + curY});
      };
  const {x, y} = helper(vectors);
  return x * y;
}

function partTwo(lines: Array<string>): number {
  const vectors = lines.map(lineToVector);
  const {x, y} = vectors.reduce(
      ({x, y, aim}: Vector2D&{aim: number}, {x: curX, y: curY}) =>
          ({aim: aim + curY, x: x + curX, y: y + (aim * curX)}),
      {x: 0, y: 0, aim: 0});
  return x * y;
}

function sum({x: x1, y: y1}: Vector2D, {x: x2, y: y2}: Vector2D): Vector2D {
  return {x: x1 + x2, y: y1 + y2};
}

function lineToVector(line: string): Vector2D {
  const [direction, mag] = line.split(' ').slice(0, 2);
  const magnitude = parseInt(mag);
  switch (direction) {
    case 'forward':
      return {x: magnitude, y: 0};
    case 'up':
      return {x: 0, y: -magnitude};
    case 'down':
      return {x: 0, y: magnitude};
    default:
      throw new Error(`Bad direction: ${direction}`);
  }
}
