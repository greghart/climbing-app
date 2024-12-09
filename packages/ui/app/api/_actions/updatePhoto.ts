"use server";
import getPhotoRedirect from "@/app/_util/getPhotoRedirect";
import formAction from "@/app/api/formAction";
import { getDataSource, PhotoSchema } from "@/db";
import { IPhoto } from "models";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

type Model = Pick<IPhoto, "title" | "description">;
type Meta = { id: number };
// TODO: Re-use base schema for create and update? Upload not needed here, more trouble than worth for now
const schema = z.object({
  title: z.string().min(5).max(1000).optional(),
  description: z.string().max(1000).optional(),
});

const updatePhoto = formAction<Model, z.infer<typeof schema>, Meta>(
  schema,
  async (res, data, prevState) => {
    const ds = await getDataSource();
    const photo = await ds.getRepository(PhotoSchema).findOne({
      where: { id: prevState.meta.id },
      relations: ["photoable"],
    });
    if (!photo) return res.withErr("Photo not found");
    Object.assign(photo, data);
    const saved = await ds.getRepository(PhotoSchema).save(photo);

    const redirectUrl = getPhotoRedirect(photo.photoable, saved);
    if (redirectUrl.length > 0) {
      redirect(redirectUrl); // Navigate to the new post page
    } else {
      return res.respond(saved, "Photo saved");
    }
  }
);

export default updatePhoto;
