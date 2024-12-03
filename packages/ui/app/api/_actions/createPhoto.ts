"use server";
import formAction from "@/app/api/formAction";
import {
  getDataSource,
  Photo,
  Photoable,
  PhotoableSchema,
  PhotoSchema,
} from "@/db";
import { IPhoto } from "models";
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
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

const createPhoto = formAction<Model, z.infer<typeof schema>, Meta>(
  schema,
  async (res, data, prevState) => {
    const ds = await getDataSource();
    const photoable = await ds.getRepository(PhotoableSchema).findOne({
      where: { id: prevState.meta.photoable_id },
    });
    if (!photoable) return res.err("Photoable not found");

    const newPhoto = {
      photoable,
      ...data,
      upload: undefined, // TODO Upload and create an upload record
    };
    console.warn("upload", data.upload);
    const saved = await ds.getRepository(PhotoSchema).save(newPhoto);

    const redirectUrl = getRedirect(photoable, saved);
    if (redirectUrl.length > 0) {
      redirect(redirectUrl); // Navigate to the new post page
    } else {
      return res.respond(saved, "Photo saved");
    }
  }
);

function getRedirect(photoable: Photoable, photo: Photo): string {
  const tokens = photoable.descriptor.split("-");
  if (tokens.length != 2) return "";
  if (tokens[0] === "crag")
    return `/crags/${tokens[1]}/photos?highlight=${photo.id}`;
  if (tokens[0] === "area")
    return `/areas/${tokens[1]}/photos?highlight=${photo.id}`;
  if (tokens[0] === "boulder")
    return `/boulders/${tokens[1]}/photos?highlight=${photo.id}`;
  if (tokens[0] === "route")
    return `/routes/${tokens[1]}/photos?highlight=${photo.id}`;
  return "";
}

export default createPhoto;
