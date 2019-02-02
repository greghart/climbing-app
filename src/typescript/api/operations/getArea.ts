import { getRepository, FindOneOptions } from 'typeorm';

import Area from '../../models/Area';

interface Options {
  includeComments: boolean;
}

const getArea = (id: string | number, options: Options = { includeComments: false }) => {
  const query = getRepository(Area).createQueryBuilder('areas')
  .whereInIds(id)
  .leftJoinAndSelect('areas.boulders', 'boulders')
  .leftJoinAndSelect('areas.crag', 'crag')
  .leftJoinAndSelect('areas.coordinates', 'coordinates')
  if (options.includeComments) {
    query.leftJoinAndSelect('areas.commentable', 'commentable');
    query.leftJoinAndSelect('commentable.comments', 'comments');
    query.leftJoinAndSelect('comments.user', 'user');
    query.orderBy({
      'comments.id': 'DESC'
    });
  }

  return query.getOne()
  .then((area) => {
    // Signal client that we've not found comments
    if (options.includeComments && area.commentable === undefined) {
      area.commentable = null;
    }
    return area;
  });
};

export default getArea;


