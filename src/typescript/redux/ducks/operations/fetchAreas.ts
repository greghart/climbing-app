import { AreaSchema } from '../../normalizr';
import { SwaggerAPI } from './util/getSwagger';
import { ArgumentTypes } from '../../../externals';
import fetchEntities from './util/fetchEntities';

export default fetchEntities<ArgumentTypes<SwaggerAPI['areas']['getAreas']>>(
  (swagger, ids, includeComments) => {
    return swagger.areas.getAreas(ids, includeComments);
  },
  [AreaSchema]
);

