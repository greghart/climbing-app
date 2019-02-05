import * as path from 'path';
import * as config from 'config';
import * as util from 'util';
import { MetadataGenerator } from 'typescript-rest-swagger/dist/metadata/metadataGenerator';
import { SpecGenerator } from 'typescript-rest-swagger/dist/swagger/generator';

const swaggerConfig = {
  ...config.get<object>('server.swagger'),
  entryFile: path.join(__dirname + '/../../../src/typescript/api/index.ts')
};

/**
 * Builds a swagger file of our API
 */
export default () => {
  const metadata = new MetadataGenerator(swaggerConfig.entryFile).generate();
  const spec = new SpecGenerator(metadata, swaggerConfig as any).getSpec();
  console.log({
    swaggerConfig,
  });
  console.log(util.inspect(spec, { depth: null }))
  return spec;
}
