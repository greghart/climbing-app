import crypto from "crypto";
import * as path from "path";
import { getEngine, MulterFileSource } from "power-putty-io";

import myDataSource from "../../db/myDataSource";
import Upload from "../../models/Upload";

function hashData(data: Buffer) {
  return crypto.createHash("sha1").update(data).digest("hex");
}

function uploadFile(
  file: Express.Multer.File,
  directory: string
): Promise<Upload> {
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
  return (
    myDataSource
      .getRepository(Upload)
      .findOne({ where: { key } })
      .then((existingUpload) => {
        if (existingUpload) {
          return existingUpload;
        }
        return myDataSource.getRepository(Upload).save(upload);
      })
      // Persist in file store
      .then((upload) => {
        return engine
          .upload(upload, new MulterFileSource(file))
          .then(() => upload);
      })
  );
}

export default uploadFile;
