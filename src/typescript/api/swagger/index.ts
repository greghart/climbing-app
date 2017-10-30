const $RefParser = require('json-schema-ref-parser');
import * as path from 'path';
import * as Promise from 'bluebird';
import * as util from 'util';

import isLocal from '../../util/isLocal';

const resolvedDoc = Promise.resolve(
  $RefParser.bundle(
    path.resolve(__dirname, './index.yaml')
  )
)
.then((api) => {
  if (isLocal()) {
    return {
      ...api,
      schemes: ['http']
    };
  }
  return api;
});

if (module.parent === null) {
  resolvedDoc
  .then((api) => {
    console.log('Resolved Swagger API');
    console.log(util.inspect(api, false, undefined, true));
  })
  .catch((error) => {
    console.error('Error while bundling Swagger API');
    console.error(error);
  });
}

// Note this returns a Promise
export default resolvedDoc;
