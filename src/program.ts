import {Command} from 'commander';

import {read} from './input-helpers';

type Solution = (lines: Array<string>) => number;

export function program(partOne: Solution, partTwo: Solution) {
  const program = new Command();
  program.option('-f, --file <filename>', 'Input file');
  program.parse(process.argv);
  const lines = read(program.opts().file);
  console.log(partOne(lines));
  console.log(partTwo(lines));
}
