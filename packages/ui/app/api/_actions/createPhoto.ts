"use server";
import formAction from "@/app/api/formAction";
import {
  dataSource,
  getDataSource,
  PhotoableSchema,
  PhotoSchema,
  UploadSchema,
} from "@/db";
import { IPhoto, IUpload } from "models";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

// TODO: Add uploading and saving of photos using power-putty
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

type Model = Pick<IPhoto, "title" | "description" | "upload">;
type Meta = { photoable_id: number };
const schema = z.object({
  title: z.string().min(5).max(1000),
  description: z.string().max(1000).optional(),
  upload: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((file) => {
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, ".jpg, .jpeg, .png and .webp files are accepted."),
});

/**
 * TODO Refactor this else where
 */
import config from "@/app/api/config";
import getPhotoRedirect from "@/app/api/getPhotoRedirect";
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

async function uploadFile(f: File, dir: string) {
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
        if (existingUpload) {
          throw new Error("upload already exists");
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

const createPhoto = formAction<Model, z.infer<typeof schema>, Meta>(
  schema,
  async (res, data, prevState) => {
    const ds = await getDataSource();
    const photoable = await ds.getRepository(PhotoableSchema).findOne({
      where: { id: prevState.meta.photoable_id },
    });
    if (!photoable) return res.withErr("Photoable not found");

    let upload: IUpload;
    try {
      upload = await uploadFile(data.upload, "photos");
    } catch (e: any) {
      return res.withErr(`Error uploading file: ${e.message}`);
    }
    const newPhoto = {
      photoable,
      ...data,
      upload,
    };
    const saved = await ds.getRepository(PhotoSchema).save(newPhoto);

    const redirectUrl = getPhotoRedirect(photoable, saved);
    if (redirectUrl.length > 0) {
      redirect(redirectUrl); // Navigate to the new post page
    } else {
      return res.respond(saved, "Photo saved");
    }
  }
);

export default createPhoto;
