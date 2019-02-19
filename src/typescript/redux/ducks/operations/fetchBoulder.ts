import { BoulderSchema } from '../../normalizr';
import { SwaggerAPI } from './util/getSwagger';
import { ArgumentTypes } from '../../../externals';
import fetchEntities from './util/fetchEntities';

export default fetchEntities<ArgumentTypes<SwaggerAPI['boulders']['getBoulder']>>(
  (swagger, id, includeComments) => {
    return swagger.boulders.getBoulder(id, includeComments);
  },
  BoulderSchema,
);
