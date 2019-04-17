import { EntityRepository, Repository } from 'typeorm';
import Trail from '../Trail';
import get from 'lodash/get';

// Base interface for a trail entity
interface TrailEntity {
  id: any;
  trail?: Trail;
}

/**
 * A custom trail repository repository to help us abstract away the
 * polymorphic associations
 */
@EntityRepository(Trail)
export default class TrailRepository extends Repository<Trail> {

  /**
   * Find or get the trail instance for an entity
   *
   * @returns a trail that will be attached to the entity
   */
  async findOrGetTrail(entity: TrailEntity) {
    // Find an existing trail, if any
    let trail = entity.trail ?
      entity.trail :
      get(await
        this.manager.getRepository(entity.constructor)
        .createQueryBuilder('entity')
        .innerJoinAndSelect('entity.trail', 'trail')
        .whereInIds(entity.id)
        .getOne()
      ,   'trail');
    if (!trail) {
      trail = new Trail();
      trail.name = `${entity.constructor.name}-${entity.id}`;
      await this.manager.save(trail);
      entity.trail = trail;
      await this.manager.save(entity);
    }
    return trail;
  }

}
