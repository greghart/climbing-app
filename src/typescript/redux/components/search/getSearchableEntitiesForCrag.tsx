import reduce = require('lodash/reduce');
import Crag from "../../../models/Crag";
import Area from '../../../models/Area';
import Boulder from '../../../models/Boulder';
import Route from '../../../models/Route';

function getSearchableEntitiesForCrag(crag: Crag): Array<Area | Boulder | Route> {
  return reduce(
    crag.areas,
    (memo, area) => {
      memo.push(area);
      memo = memo.concat(area.boulders);
      memo = memo.concat(
        reduce(
          area.boulders,
          (memo, boulder) => {
            return memo.concat(boulder.routes)
          },
          []
        )
      );
      return memo;
    },
    []
  );
}

export default getSearchableEntitiesForCrag;
