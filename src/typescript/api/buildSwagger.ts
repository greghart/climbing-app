import * as path from 'path';
import * as config from 'config';
import { MetadataGenerator } from 'typescript-rest-swagger/dist/metadata/metadataGenerator';
import { SpecGenerator } from 'typescript-rest-swagger/dist/swagger/generator';

const swaggerConfig = {
  ...config.get<object>('server.swagger'),
  entryFile: path.join(__dirname + '/../../../src/typescript/api/index.ts')
};

/**
 * Builds a swagger file of our API
 *
 * @todo Note, currently the generator doesn't handle complicated TypeORM types, so
 * we need to manually annotate if we want proper return types.
 */
export default () => {
  const metadata = new MetadataGenerator(swaggerConfig.entryFile).generate();
  const spec = new SpecGenerator(metadata, swaggerConfig as any).getSpec();
  console.log({
    swaggerConfig,
    spec
  });
  return spec;
}
