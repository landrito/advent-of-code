import {program} from '../../../program';

const INDICES = [0, 1, 2, 3, 4];
const WINNING_ROWS = INDICES.map(row => INDICES.map(col => `${row},${col}`));
const WINNING_COLS = INDICES.map(col => INDICES.map(row => `${row},${col}`));
const WINNING_LINES = [
  ...WINNING_ROWS,
  ...WINNING_COLS,
];

class Board {
  values = new Set<number>();
  positions: {[val: number]: string} = {};
  constructor(rows: Array<Array<number>>) {
    rows.forEach((row, i) => {
      row.forEach((val, j) => {
        this.positions[val] = `${i},${j}`;
        this.values.add(val);
      });
    });
  }

  hasBingo(drawn: Array<number>) {
    drawn = drawn.filter(d => this.values.has(d));
    if (drawn.length < 5) {
      return false;
    }
    const drawnPositions = new Set(drawn.map(d => this.positions[d]));
    for (const line of WINNING_LINES) {
      const bingo =
          line.reduce((bingo, pos) => bingo && drawnPositions.has(pos), true);
      if (bingo) {
        return true;
      }
    }
    return false;
  }

  calculateWin(drawn: number[]): number {
    const winningDraw = drawn[drawn.length - 1];
    const drawnSet = new Set(drawn);
    const values = [...this.values];
    const sumOfUnmarked =
        values.filter(v => !drawnSet.has(v)).reduce((x, y) => x + y, 0);

    return sumOfUnmarked * winningDraw;
  }
}

interface Bingo {
  drawn: Array<number>;
  boards: Array<Board>;
}

function partOne(lines: Array<string>): number {
  const bingo = inputToBingo(lines);
  for (let i = 4; i < bingo.drawn.length; i++) {
    const slice = bingo.drawn.slice(0, i + 1);
    for (const board of bingo.boards) {
      if (board.hasBingo(slice)) {
        return board.calculateWin(slice);
      }
    }
  }
  return -1;
}

function partTwo(lines: Array<string>): number {
  const bingo = inputToBingo(lines);
  const bingodBoards = new Set<Board>();
  let boards = [...bingo.boards];

  for (let i = 4; i < bingo.drawn.length; i++) {
    const slice = bingo.drawn.slice(0, i + 1);
    for (const board of boards) {
      if (board.hasBingo(slice)) {
        bingodBoards.add(board);
        if (boards.length === 1) {
          return board.calculateWin(slice);
        }
      }
    }
    boards = boards.filter(b => !bingodBoards.has(b));
  }
  return -1;
}

function inputToBingo(lines: Array<string>): Bingo {
  let [drawnString, ...rest] = lines;
  const drawn = delimitedNumsToArray(',', drawnString);
  let boards: Array<Board> = [];
  let r1, r2, r3, r4, r5: string;

  while (rest.length) {
    [r1, r2, r3, r4, r5, ...rest] = rest;
    const rows = [r1, r2, r3, r4, r5]
                     .map(s => delimitedNumsToArray(' ', s))
                     .map(([c1, c2, c3, c4, c5]) => [c1, c2, c3, c4, c5]);
    boards = [...boards, new Board(rows)];
  }

  return {
    drawn, boards
  }
}

function delimitedNumsToArray(delimiter: string, s: string): Array<number> {
  const split = s.split(delimiter);
  return split.map(s => s.trim()).filter(s => !!s).map(s => parseInt(s));
}

program(partOne, partTwo);
