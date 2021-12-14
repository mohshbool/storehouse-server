import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';

@Injectable()
export class HelpersService {
  readFileAsync: any;
  writeFileAsync: any;

  constructor() {
    this.readFileAsync = promisify(readFile);
    this.writeFileAsync = promisify(writeFile);
  }

  //https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
  async asyncForEach(
    array: Array<any>,
    callback: (item: any, index: number, array: Array<any>) => Promise<any>,
    next?: (item: any) => void,
  ): Promise<void> {
    for (let index = 0; index < array.length; index++) {
      const returnValue = await callback(array[index], index, array);
      if (next) next(returnValue);
    }
  }
}
