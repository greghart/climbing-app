import myDataSource from "../../db/myDataSource";
import Photo from "../Photo";
import Photoable from "../Photoable";
import get from "lodash/get";

// Base interface for a photoable entity
interface PhotoableEntity {
  id: any;
  photoable: Photoable | null;
}

/**
 * A custom photo repository repository to help us abstract away the
 * polymorphic associations
 */
const PhotoRepository = myDataSource.getRepository(Photo).extend({
  /**
   * Find or get the photoable instance for an entity
   *
   * @returns a photoable that will be attached to the entity
   */
  async findOrGetPhotoable(entity: PhotoableEntity) {
    // Find an existing photoable, if any
    let photoable = entity.photoable
      ? entity.photoable
      : get(
          await this.manager
            .getRepository(entity.constructor)
            .createQueryBuilder("entity")
            .innerJoinAndSelect("entity.photoable", "photoable")
            .whereInIds(entity.id)
            .getOne(),
          "photoable"
        );
    if (!photoable) {
      photoable = new Photoable();
      photoable.descriptor = `${entity.constructor.name}-${entity.id}`;
      await this.manager.save(photoable);
      entity.photoable = photoable;
      await this.manager.save(entity);
    }
    return photoable;
  },
});

export default PhotoRepository;
