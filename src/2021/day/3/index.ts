import {Command} from 'commander';

import {read} from '../../../input-helpers';

function main() {
  const program = new Command();
  program.option('-f, --file <filename>', 'Input file');
  program.parse(process.argv);
  const lines = read(program.opts().file);
  console.log(partOne(lines));
  console.log(partTwo(lines));
}
main();

function partOne(lines: Array<string>) {
  const [firstBits, ...rest] = lines.map(lineToBits);
  const oneCount = rest.reduce((previous, current) => {
    return previous.map((i, index) => i + oneCounter(current[index]));
  }, firstBits.map(oneCounter) as Array<number>);
  const gamma = oneCount.map(mostFrequent).join('');
  const epsilon = oneCount.map(leastFrequent).join('');
  return parseInt(gamma, 2) * parseInt(epsilon, 2);
}

function mostFrequent(oneCount: number): 1|0 {
  return oneCount >= 0 ? 1 : 0;
}

function leastFrequent(oneCount: number): 1|0 {
  return oneCount >= 0 ? 0 : 1;
}

function partTwo(lines: Array<string>) {
  const bitLines = lines.map(lineToBits);
  const helper =
      (bitLines: Array<Array<1|0>>, criteria: (oneCount: number) => 1 | 0,
       index: number = 0): Array<1|0> => {
        if (bitLines.length === 1) {
          return bitLines[0];
        }
        const oneCount = bitLines.reduce(
            (oneCount, line) => oneCount + oneCounter(line[index]), 0);
        const search = criteria(oneCount);
        const match = bitLines.filter(b => b[index] === search);
        return helper(match, criteria, index + 1);
      };
  const o2RatingStr = helper(bitLines, mostFrequent).join('');
  const co2RationStr = helper(bitLines, leastFrequent).join('');
  return parseInt(o2RatingStr, 2) * parseInt(co2RationStr, 2);
}

function oneCounter(n: 1|0): 1|- 1 {
  return !!n ? 1 : -1;
}

function lineToBits(line: string): Array<1|0> {
  return line.split('').map(c => c === '1' ? 1 : 0);
}
