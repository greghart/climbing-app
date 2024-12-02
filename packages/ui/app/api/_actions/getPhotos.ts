import { PhotoableSchema, getDataSource } from "@/db";
import PhotoRepository, { PhotoableEntity } from "@/db/repos/PhotoRepository";
import { cache } from "react";
import "server-only";
import { EntitySchema } from "typeorm";

/**
 * getPhotos returns photos for given entity.
 * Curried for ease of use.
 */
function getPhotos(schema: EntitySchema<PhotoableEntity>) {
  return cache(async (id: number) => {
    const ds = await getDataSource();
    const entity = await ds.getRepository(schema).findOne({
      where: { id },
    });
    if (!entity) return;

    const photoable = await ds.manager
      .withRepository(PhotoRepository)
      .findOrGetPhotoable(entity, schema);

    return ds.getRepository(PhotoableSchema).findOne({
      where: { id: photoable.id },
      relations: ["photos"], // TODO: add and get user relation
    });
  });
}

export default getPhotos;
