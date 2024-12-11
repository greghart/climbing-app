import { PhotoSchema, getDataSource } from "@/db";
import { cache } from "react";
import "server-only";

/**
 * getPhoto returns a specific photo alongside parent entity.
 */
const getPhoto = cache(async (id: number) => {
  const ds = await getDataSource();
  return await ds.getRepository(PhotoSchema).findOne({
    where: { id },
    relations: ["photoable", "photoable.crag", "upload"],
  });
});

export default getPhoto;
