import * as crypto from 'crypto';
import * as path from 'path';

import Upload from '../../models/Upload';
import getEngine from '../../io/getEngine';
import FileSource from '../../io/FileSource';
import { getRepository } from 'typeorm';
import DataSource from '../../io/DataSource';

function hashData(data: Buffer) {
  return crypto.createHash('sha1')
  .update(data)
  .digest('hex');
}

function uploadFile(file: Express.Multer.File, directory: string): Promise<Upload> {
  const engine = getEngine();

  const hash = hashData(file.buffer);
  const upload = new Upload();
  upload.directory = directory;
  upload.engine = engine.getCode();
  upload.fileSize = file.size;
  // For now use hash as the filename
  upload.key = `${hash}${path.extname(file.originalname)}`;
  upload.originalName = file.originalname;
  upload.sha1Hash = hash;
  upload.uploadedAt = new Date();

  return getRepository(Upload).save(upload)
  .then(() => {
    return engine.upload(upload, new FileSource(file));
  })
  .then(() => upload);
}

export default uploadFile;
