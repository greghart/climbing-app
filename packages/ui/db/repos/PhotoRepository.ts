import * as db from "@/db";
import { dataSource } from "@/db/getDataSource";
import { get } from "lodash-es";
import * as models from "models";
import { EntitySchema } from "typeorm";

// Base interface for a photoable entity
export interface PhotoableEntity {
  id?: any;
  photoable?: models.IPhotoable;
}

/**
 * A custom photo repository repository to help us abstract away the
 * polymorphic associations
 * TODO: Eventually would be nice to setup a type safe pattern for this, pretty complicated though
 */
const PhotoRepository = dataSource.getRepository(db.PhotoSchema).extend({
  /**
   * Find or get the photoable instance for an entity
   *
   * @returns a photoable that will be attached to the entity
   */
  async findOrGetPhotoable(entity: PhotoableEntity, schema: EntitySchema<any>) {
    // Find an existing photoable, if any
    let photoable = entity.photoable
      ? entity.photoable
      : get(
          await this.manager
            .getRepository(schema)
            .createQueryBuilder("entity")
            .innerJoinAndSelect("entity.photoable", "photoable")
            .whereInIds(entity.id)
            .getOne(),
          "photoable"
        );
    if (!photoable) {
      photoable = new models.Photoable({
        descriptor: `${schema.options.name}-${entity.id}`,
      });
      await this.manager.getRepository(db.PhotoableSchema).save(photoable);
      entity.photoable = photoable;
      await this.manager.getRepository(schema).save(entity);
    }
    return photoable;
  },

  async photoOn(
    entity: PhotoableEntity,
    schema: EntitySchema<any>,
    photo: models.IPhoto
  ) {
    photo.photoable = await this.findOrGetPhotoable(entity, schema);
    return this.manager.getRepository(db.PhotoSchema).save(photo);
  },
});

export default PhotoRepository;
