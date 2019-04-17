import reduce from 'lodash/reduce';
import isArray from 'lodash/isArray';
import Crag from '../../../models/Crag';
import Area from '../../../models/Area';
import Boulder from '../../../models/Boulder';
import Route from '../../../models/Route';

type Tag = 'area' | 'boulder' | 'route';
type Tagged = { _type?: Tag };
type Searchable = Tagged & (Area | Boulder | Route);

const withType = (type: Tag) => (extra) => (input) => {
  if (isArray(input)) {
    return input.map(withType(type)(extra));
  }
  return {
    ...input,
    ...extra,
    _type: type,
  };
};
const withArea = withType('area');
const withBoulder = withType('boulder');
const withRoute = withType('route');

function getSearchableEntitiesForCrag(crag: Crag): Array<Searchable> {
  return reduce(
    crag.areas,
    (memo, area) => {
      memo.push(withArea({})(area));
      return memo
      .concat(withBoulder({ area })(area.boulders || []))
      .concat(
        reduce(
          area.boulders,
          (memo, boulder) => {
            return memo.concat(withRoute({ boulder: { ...boulder, area } })(boulder.routes || []));
          },
          [],
        ),
      );
    },
    [],
  );
}

function isArea(input: Searchable): input is Area {
  return input._type === 'area';
}
function isBoulder(input: Searchable): input is Boulder {
  return input._type === 'boulder';
}
function isRoute(input: Searchable): input is Route {
  return input._type === 'route';
}
export { isArea, isBoulder, isRoute, Tag, Searchable };
export default getSearchableEntitiesForCrag;
