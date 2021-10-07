import {lines} from '../../../input-helpers';


export class AsyncStream<I> {
  buffer: Array<I> = [];
  closed: boolean = false;

  map<O>(f: (i: I) => O): AsyncStream<O> {
    const ret = new AsyncStream<O>();
    const interval = setInterval(() => {
      while (this.buffer.length > 0) {
        ret.push(f(this.buffer.pop()!))
      }
      if (this.closed) {
        clearInterval(interval);
      }
    }, 100)

    return ret;
  }

  async reduce<O>(f: (accumulator: O, next: I) => O, init: O): Promise<O> {
    return new Promise(async (resolve, reject) => {
      try {
        const interval = setInterval(async () => {
          while (this.buffer.length > 0) {
            init = f(init, this.buffer.pop()!);
          }
          if (this.closed) {
            clearInterval(interval);
            resolve(init);
          }
        }, 100);
      } catch (e: unknown) {
        reject(e);
      }
    });
  }

  close() {
    this.closed = true;
  }

  push(i: I) {
    this.buffer.push(i);
  }
}

export class FileReadStream extends AsyncStream<String> {
  constructor(private readonly file: string) {
    super();
  }

  map<O>(f: (i: string) => O): AsyncStream<O> {
    const ls = lines(this.file);
    const interval = setInterval(async () => {
      const l = await ls.next();
      if (l.done) {
        clearInterval(interval);
        this.close();
      }
    });
    return this.map(f);
  }
}


function countDistinctInLine(line: string) {
  return line.split('')
      .filter(c => {
        switch (c) {
          case 'a':
          case 'b':
          case 'c':
          case 'x':
          case 'y':
          case 'z':
            return true;
          default:
            return false;
        }
      })
      .reduce((s, c) => s.add(c), new Set<string>())
      .size;
}

export async function countDistinctInLines(): Promise<number> {
  let count = 0;
  for await (const line of lines(
      '/Users/landrito/Code/advent-of-code/src/2020/day/6/input.txt')) {
    count = count + countDistinctInLine(line);
  }
  return count;
}

async function main() {
  console.log('Part 1');
  console.log(await countDistinctInLines());
}
main();
