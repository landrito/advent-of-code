import {program} from '../../../program';

interface Line {
  start: Coordinate;
  end: Coordinate;
}

interface Coordinate {
  x: number;
  y: number;
}

function partOne(input: Array<string>): number {
  return solution(
      inputToLines(input).filter(l => isHorizontal(l) || isVertical(l)));
}

function partTwo(input: Array<string>): number {
  return solution(inputToLines(input));
}

function solution(lines: Array<Line>): number {
  const positions = new Map<string, number>();
  for (const {start, end} of lines) {
    let vector = {
      x: start.x === end.x ? 0 :
          start.x < end.x  ? 1 :
                             -1,
      y: start.y === end.y ? 0 :
          start.y < end.y  ? 1 :
                             -1
    };

    let current = {
      x: start.x,
      y: start.y,
    };
    while (current.x !== end.x || current.y !== end.y) {
      const strCoord = `${current.x},${current.y}`;
      positions.set(
          strCoord, positions.has(strCoord) ? positions.get(strCoord)! + 1 : 1);
      current = {
        x: current.x + vector.x,
        y: current.y + vector.y,
      }
    }
    const strCoord = `${end.x},${end.y}`;
    positions.set(
        strCoord, positions.has(strCoord) ? positions.get(strCoord)! + 1 : 1);
  }
  return [...positions.entries()].reduce((count, [_, value]) => {
    return value > 1 ? count + 1 : count;
  }, 0)
}

function inputToLines(lines: Array<string>): Array<Line> {
  return lines.map(l => {
    const [start, _, end] = l.split(' ');
    return {
      start: commaDelimitedToCoordinate(start),
          end: commaDelimitedToCoordinate(end)
    }
  });
}

function commaDelimitedToCoordinate(s: string): Coordinate {
  const [x, y] = s.split(',').map(v => parseInt(v));
  return {x, y};
}

function isHorizontal({start, end}: Line): boolean {
  return start.y === end.y;
}

function isVertical({start, end}: Line): boolean {
  return start.x === end.x;
}

program(partOne, partTwo);
