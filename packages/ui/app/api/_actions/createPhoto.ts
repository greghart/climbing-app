"use server";
import getPhotoRedirect from "@/app/_util/getPhotoRedirect";
import formAction from "@/app/api/formAction";
import uploadFile from "@/app/api/uploadFile";
import { getDataSource, PhotoableSchema, PhotoSchema } from "@/db";
import { IPhoto, IUpload } from "models";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

const MAX_FILE_SIZE = 50 * 1000 * 1000; // 50 MB
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
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 50MB.`)
    .refine((file) => {
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, ".jpg, .jpeg, .png and .webp files are accepted."),
});

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
