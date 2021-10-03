import * as readline from 'readline';
import * as fs from 'fs';

export function readStream(file: string): Promise<fs.ReadStream>{
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(file);
    fileStream.on('error', reject).on('open', () => {
      resolve(fileStream);
    });
  });
}

export async function *lines(file: string): AsyncGenerator<string> {
  const fileStream = await readStream(file);

  const rl = readline.createInterface(fileStream);

  for await (const line of rl) {
    yield line;
  }
}
