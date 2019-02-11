import { getRepository } from 'typeorm';

import Route from '../../models/Route';

interface Options {
  includeComments: boolean;
}

const getRoute = (id: string | number, options: Options = { includeComments: false }) => {
  const query = getRepository(Route).createQueryBuilder('routes')
  .whereInIds(id)
  .leftJoinAndSelect('routes.boulder', 'boulder')
  .leftJoinAndSelect('boulder.polygon', 'polygon')
  .leftJoinAndSelect('polygon.coordinates', 'coordinates')
  .leftJoinAndSelect('boulder.area', 'area')
  .leftJoinAndSelect('area.crag', 'crag')
  if (options.includeComments) {
    query.leftJoinAndSelect('routes.commentable', 'commentable');
    query.leftJoinAndSelect('commentable.comments', 'comments');
    query.leftJoinAndSelect('comments.user', 'user');
    query.orderBy({
      'comments.id': 'DESC'
    });
  }

  return query.getOne()
  .then((route) => {
    // Signal client that we've not found comments
    if (options.includeComments && route.commentable === undefined) {
      route.commentable = null;
    }
    return route;
  });
};

export default getRoute;
