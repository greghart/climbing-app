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

  const upload = new Upload();
  const hash = hashData(file.buffer);
  const key = `${hash}${path.extname(file.originalname)}`;
  upload.directory = directory;
  upload.engine = engine.getCode();
  upload.fileSize = file.size;
  // For now use hash as the filename
  upload.key = key;
  upload.originalName = file.originalname;
  upload.sha1Hash = hash;
  upload.uploadedAt = new Date();

  // Find upload with existing key, or save new one.
  // Basically if someone uploads the same file, we can re-use
  return getRepository(Upload).findOne({ where: { key } })
  .then((existingUpload) => {
    if (existingUpload) {
      return existingUpload;
    }
    return getRepository(Upload).save(upload);
  })
  // Always re-upload, just in case it's gone I guess
  // TODO This is code smell because local stores in tmp -- fix that?
  .then((upload) => {
    return engine.upload(upload, new FileSource(file))
    .then(() => upload);
  });
}

export default uploadFile;
