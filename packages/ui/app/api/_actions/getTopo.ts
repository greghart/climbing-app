import getArea from "@/app/api/_actions/getArea";
import getBoulder from "@/app/api/_actions/getBoulder";
import getCrag from "@/app/api/_actions/getCrag";
import { getDataSource, PhotoSchema } from "@/db";
import { Boulder, IArea, IPhotoable, Route } from "models";
import { cache } from "react";
import "server-only";

/**
 * getTopo returns topo, if any, for a photo, and returns potentially
 * related entities to this photo.
 * Eg. a boulder photo can relate to routes
 */
const getTopo = cache(async (id: number) => {
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
      "topo.topogons",
    ],
  });
  if (!photo) {
    throw new Error("Photo not found, you messed up");
  }
  if (photo.topo?.topogons) {
    photo.topo.topogons = photo.topo.topogons?.map((topogon) => ({
      ...topogon,
      data: JSON.parse(topogon.data as any as string),
    }));
  }
  // Potentially related entities
  // Crag photos can relate topogons to areas
  // Area photos can relate topogons to boulders
  // Boulder photos can relate topogons to routes
  // Route photos can't relate to anything else
  return { photo, entities: await getTopogonEntities(photo?.photoable) };
});

// Type to help map generic data to an actual record on backend
export type TopogonEntity = "area" | "boulder" | "route";
export type TopogonEntitiesPool = {
  type: TopogonEntity;
  entities: IArea[] | Boulder[] | Route[];
};

const getTopogonEntities = cache(
  async (photoable: IPhotoable): Promise<TopogonEntitiesPool | undefined> => {
    if (photoable.crag) {
      const crag = await getCrag(photoable.crag!.id!);
      return { type: "area", entities: crag!.areas! };
    }
    if (photoable.area) {
      const area = await getArea(photoable.area!.id!);
      return { type: "boulder", entities: area!.boulders! };
    }
    if (photoable.boulder) {
      const boulder = await getBoulder(photoable.boulder!.id!);
      return { type: "route", entities: boulder!.routes! };
    }
    return undefined;
  }
);
export default getTopo;
