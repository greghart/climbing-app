import config from "@/app/api/config";
import { dataSource, UploadSchema } from "@/db";
import crypto from "crypto";
import path from "path";
import { DataSource, getEngine } from "power-putty-io";

async function hashFile(f: File): Promise<string> {
  const hash = crypto.createHash("sha1");
  hash.setEncoding("hex");
  hash.write(Buffer.from(await f.arrayBuffer()));
  hash.end();

  return hash.read().toString();
}

export default async function uploadFile(f: File, dir: string) {
  const hash = await hashFile(f);
  const engine = getEngine(config["power-putty-io"]);
  const upload = {
    engine: engine.getCode(),
    key: `${hash}${path.extname(f.name)}`,
    directory: dir,
    fileSize: f.size,
    originalName: f.name,
    sha1Hash: hash,
    uploadedAt: new Date(),
  };
  // Find upload with existing key, or save new one
  // Basically if someone uploads the same file, we can re-use
  return (
    dataSource
      .getRepository(UploadSchema)
      .findOne({ where: { key: upload.key } })
      .then((existingUpload) => {
        // TODO: Right now we attach multiple photos to same file, which means
        // deleting one photo will delete the others. Fine for now, but maybe reconsider
        // later on
        if (existingUpload) {
          return existingUpload;
        }
        return dataSource.getRepository(UploadSchema).save(upload);
      })
      // Persist in file store
      .then(async (upload) => {
        return engine
          .upload(
            upload,
            new DataSource(f.name, Buffer.from(await f.arrayBuffer()))
          )
          .then(() => upload);
      })
  );
}
