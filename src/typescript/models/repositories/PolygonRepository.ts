import { EntityRepository, Repository } from 'typeorm';
import PolygonCoordinate from '../PolygonCoordinate';
import Polygon from '../Polygon';
import get from 'lodash/get';

// Base interface for a polygon entity
interface PolygonEntity {
  id: any;
  polygon?: Polygon;
}

/**
 * A custom polygon repository repository to help us abstract away the
 * polymorphic associations
 */
@EntityRepository(PolygonCoordinate)
export default class PolygonRepository extends Repository<PolygonCoordinate> {

  /**
   * Find or get the polygon instance for an entity
   *
   * @returns a polygon that will be attached to the entity
   */
  async findOrGetPolygon(entity: PolygonEntity) {
    // Find an existing polygon, if any
    let polygon = entity.polygon ?
      entity.polygon :
      get(await
        this.manager.getRepository(entity.constructor)
        .createQueryBuilder('entity')
        .innerJoinAndSelect('entity.polygon', 'polygon')
        .whereInIds(entity.id)
        .getOne()
      ,   'polygon');
    if (!polygon) {
      polygon = new Polygon();
      polygon.descriptor = `${entity.constructor.name}-${entity.id}`;
      await this.manager.save(polygon);
      entity.polygon = polygon;
      await this.manager.save(entity);
    }
    return polygon;
  }

}
