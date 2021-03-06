import * as path from 'path';
import config from 'config';
import * as util from 'util';
import { MetadataGenerator } from 'typescript-rest-swagger/dist/metadata/metadataGenerator';
import { SpecGenerator } from 'typescript-rest-swagger/dist/swagger/generator';

import _debug from '../debug';
const debug = _debug.extend('api:buildSwagger');

const swaggerConfig = {
  ...config.get<object>('swagger'),
  entryFile: path.join(`${__dirname}/../../../src/typescript/api/index.ts`),
};

/**
 * Builds a swagger file of our API
 */
export default () => {
  const metadata = new MetadataGenerator(swaggerConfig.entryFile).generate();
  const spec = new SpecGenerator(metadata, swaggerConfig as any).getSpec();
  debug({
    swaggerConfig,
  });
  debug(util.inspect(spec, { depth: null }));
  return spec;
};
