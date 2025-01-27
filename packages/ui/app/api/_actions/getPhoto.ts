import { PhotoSchema, getDataSource } from "@/db";
import { cache } from "react";
import "server-only";

/**
 * getPhoto returns a specific photo alongside parent entity.
 */
const getPhoto = cache(async (id: number) => {
  const ds = await getDataSource();
  const photo = await ds.getRepository(PhotoSchema).findOne({
    where: { id },
    relations: [
      "photoable",
      "photoable.crag",
      "photoable.area",
      "photoable.boulder",
      "photoable.route",
      "upload",
      "topo",
      "topo.topogons",
    ],
  });
  if (photo?.topo?.topogons) {
    photo.topo.topogons = photo.topo.topogons?.map((topogon) => ({
      ...topogon,
      data: JSON.parse(topogon.data as any as string),
    }));
  }
  return photo;
});

export default getPhoto;
