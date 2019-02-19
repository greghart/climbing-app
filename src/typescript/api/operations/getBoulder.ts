import { getRepository, FindOneOptions } from 'typeorm';

import Boulder from '../../models/Boulder';

interface Options {
  includeComments: boolean;
}

const getBoulder = (id: string | number, options: Options = { includeComments: false }) => {
  const query = getRepository(Boulder).createQueryBuilder('boulders')
  .whereInIds(id)
  .leftJoinAndSelect('boulders.routes', 'routes')
  .leftJoinAndSelect('boulders.area', 'area')
  .leftJoinAndSelect('boulders.polygon', 'polygon')
  .leftJoinAndSelect('polygon.coordinates', 'coordinates')
  .leftJoinAndSelect('area.crag', 'crag')
  .leftJoinAndSelect('area.polygon', 'area_polygon')
  .leftJoinAndSelect('area_polygon.coordinates', 'area_coordinates');
  if (options.includeComments) {
    query.leftJoinAndSelect('boulders.commentable', 'commentable');
    query.leftJoinAndSelect('commentable.comments', 'comments');
    query.leftJoinAndSelect('comments.user', 'user');
    query.orderBy({
      'comments.id': 'DESC',
    });
  }

  return query.getOne()
  .then((boulder) => {
    // Signal client that we've not found comments
    if (options.includeComments && boulder.commentable === undefined) {
      boulder.commentable = null;
    }
    return boulder;
  });
};

export default getBoulder;
