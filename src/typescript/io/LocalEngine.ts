import * as fs from 'fs';
import * as path from 'path';
import * as Bluebird from 'bluebird';
import IOEngine from './IOEngine';
import Upload from '../models/Upload';
import Source from './Source';

/**
 * I/O Engine to store things to local disk storage
 *
 * @note This obviously doesn't work with multi-instance deployments
 */
class LocalEngine implements IOEngine {

  private rootDirectory: string;
  constructor(rootDirectory: string) {
    this.rootDirectory = rootDirectory;
  }

  private resolvePath(upload: Upload) {
    return path.join(
      this.rootDirectory,
      upload.directory,
      upload.key
    );
  }

  async upload(upload: Upload, source: Source) {
    const buffer = await source.getBuffer();
    await fs.promises.mkdir(path.dirname(this.resolvePath(upload)), { recursive: true });
    await fs.promises.writeFile(
      this.resolvePath(upload),
      buffer
    );
    return buffer;
  }

  download(upload: Upload) {
    return fs.promises.readFile(this.resolvePath(upload));
  }

  downloadStream(upload: Upload) {
    return fs.createReadStream(this.resolvePath(upload));
  }

  getCode() {
    return 'local';
  }

}

export default LocalEngine;
