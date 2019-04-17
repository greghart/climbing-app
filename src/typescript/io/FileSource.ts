import * as fs from 'fs';
import Bluebird from 'bluebird';

const readFileAsync = Bluebird.promisify(fs.readFile);
import Source from './Source';

/**
 * Source to encapsulate a formidable file descriptor
 */
class FileSource implements Source {

  file: Express.Multer.File;
  /**
   * @param {object} - Formidable file descriptor
   * @see {https://www.npmjs.com/package/formidable#formidablefile}
   */
  constructor(file: Express.Multer.File) {
    this.file = file;
  }

  getOriginalName() {
    return this.file.originalname;
  }

  /**
   * @returns a memoized buffer of file contents
   */
  getBuffer() {
    return Bluebird.resolve(this.file.buffer);
  }

}

export default FileSource;
