"use server";
import formAction from "@/app/api/formAction";
import getPhotoRedirect from "@/app/api/getPhotoRedirect";
import { dataSource, getDataSource, PhotoSchema, UploadSchema } from "@/db";
import { redirect } from "next/navigation";
import "server-only";

type Meta = { id: number };
// SSR compatible delete action
const deletePhoto = formAction<any, any, Meta>(null, async (res) => {
  const ds = await getDataSource();
  console.warn(ds === dataSource);
  const photo = await dataSource.getRepository(PhotoSchema).findOne({
    where: { id: res.meta.id },
    relations: ["photoable", "upload"],
  });
  if (!photo) return res.withErr("Photo not found");
  // remove the upload, cascades to photo
  await dataSource.getRepository(UploadSchema).remove(photo.upload!);

  const redirectUrl = getPhotoRedirect(photo.photoable, photo);
  if (redirectUrl.length > 0) {
    redirect(redirectUrl); // Navigate to the new post page
  } else {
    res.respond({}, "Photo deleted");
  }
  return res;
});

export default deletePhoto;
