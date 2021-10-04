import {lines} from '../../../input-helpers';

function flbrToNumber(flbr: string): number {
  return parseInt(
      flbr.trim().replace(/f|F|l|L/g, '0').replace(/b|B|r|R/g, '1'), 2);
}

function input5() {
  return lines('/Users/landrito/Code/advent-of-code/src/2020/day/5/input.txt');
}

async function findMaxId() {
  let max: number = -1;
  for await (const line of input5()) {
    const n = flbrToNumber(line);
    max = n > max ? n : max;
  }

  return max;
}

// This function works by leveraging XOR. Since n XOR n = 0, n xor 0 = n, and
// xor is associative, we can xor every number together and then xor across the
// range and the missing number will be left since all the other numbers
// cancelled out.
async function findMissingId() {
  let search = 0;
  let max = -1;
  let min = Number.MAX_SAFE_INTEGER;

  for await (const line of input5()) {
    const n = flbrToNumber(line);
    search = search ^ n;

    min = n < min ? n : min;
    max = n > max ? n : max;
  }

  for (let i = min; i <= max; i++) {
    search = search ^ i;
  }

  return search;
}

async function main() {
  console.log('Part 1');
  console.log(await findMaxId());

  console.log('Part 2');
  console.log(await findMissingId());
}

main();
