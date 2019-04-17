import Bluebird from 'bluebird';
import Upload from '../models/Upload';
import Source from './Source';
import { Readable } from 'stream';

/**
 * An abstract I/O Engine.
 *
 * Implementations dictate how to store an Upload and subsequently read an upload
 */
interface IOEngine {

  // Upload data and return the data uploaded
  upload(upload: Upload, source: Source): Bluebird.Thenable<Buffer>;
  download(upload: Upload): Bluebird.Thenable<Buffer>;
  downloadStream(upload: Upload): Readable;
  // Code that identifies the engine used.
  // This is stored in database for posterity.
  getCode(): string;

}

export default IOEngine;
