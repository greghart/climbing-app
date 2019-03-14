import * as Express from 'express';
import * as path from 'path';
import * as mime from 'mime';
import { getRepository } from 'typeorm';

import getEngine from '../io/getEngine';
import Upload from '../models/Upload';

const ioEngineRouter = Express.Router();
const ioEngine = getEngine();

ioEngineRouter.get('/:uploadId/download', (req, res, next) => {
  const uploadId = req.params.uploadId;
  getRepository(Upload).findOne(uploadId)
  .then((upload) => {
    if (!upload) {
      res.statusCode = 404;
      throw new Error(`Upload ${uploadId} not found`);
    }
    const filename = path.basename(upload.originalName);
    const mimetype = mime.getType(upload.key);

    res.setHeader('Content-disposition', `inline; filename=${filename}`);
    res.setHeader('Content-type', mimetype);

    ioEngine.downloadStream(upload).pipe(res);
  })
  .catch((err) => {
    next(err);
    return;
  });
});

export default ioEngineRouter;
