import { AreaSchema } from '../../normalizr';
import { SwaggerAPI } from './util/getSwagger';
import { ArgumentTypes } from '../../../externals';
import fetchEntities from './util/fetchEntities';

export default fetchEntities<ArgumentTypes<SwaggerAPI['areas']['getArea']>>(
  (swagger, id, includeComments) => {
    return swagger.areas.getArea(id, includeComments);
  },
  AreaSchema
);

