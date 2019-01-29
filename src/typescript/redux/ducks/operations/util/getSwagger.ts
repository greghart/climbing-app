import * as inflection from 'inflection';
import reduce = require('lodash/reduce');
import * as Return from 'typescript-rest/dist/server-return';

import { CragsServiceType } from "../../../../api/services/CragsService";
import { RoutesServiceType } from '../../../../api/services/RoutesService';
import { ArgumentTypes } from '../../../../externals';

/**
 * Setup a type-safe swagger client
 */

/**
 * Some very helpful types to extract just methods from our services (just in case)
 * https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
 */
type BasicFunction = (...args: any[]) => any;
type FilterFlags<Base, Condition> = {
  [Key in keyof Base]:
      Base[Key] extends Condition ? Key : never
};
type AllowedNames<Base, Condition> =
        FilterFlags<Base, Condition>[keyof Base]
type SubType<Base, Condition> =
        Pick<Base, AllowedNames<Base, Condition>>
type ExtractNewResource<T> = T extends Promise<Return.NewResource<infer X>> ? X : T;
type Extracted<Base> = {
  [Key in keyof Base]:
    Base[Key] extends BasicFunction ? (...args: ArgumentTypes<Base[Key]>) => ExtractNewResource<ReturnType<Base[Key]>> : Base[Key]
}
/**
 * We must manually declare our operations, as we want to skip a codegen step and
 * can't use transformers consistently or easily.
 * Basically, we need an isomorphic way to view our services.
 *
 * Additionally, we must map our method signatures (which are broken down with `typescript-rest`) to
 * the object signature Swagger expects
 */
interface SwaggerAPI {
  crags: Extracted<SubType<CragsServiceType, BasicFunction>>,
  routes: Extracted<SubType<RoutesServiceType, BasicFunction>>
}
type DeclaredRoute<Service extends keyof SwaggerAPI, Op extends keyof SwaggerAPI[Service]> = (
  true |
  (SwaggerAPI[Service][Op] extends Function ? ((...args: ArgumentTypes<SwaggerAPI[Service][Op]>) => Object | null): never) | undefined
);
type DeclaredRoutes = {
  [Service in keyof SwaggerAPI]: {
    [Op in keyof SwaggerAPI[Service]]?: DeclaredRoute<Service, Op>
  }
}
const declaredRoutes: DeclaredRoutes = {
  crags: {
    getCrags: true,
  },
  routes: {
    getRoute: (id, includeComments) => { return { id, includeComments } },
    addComment: (id, data) => { return { id, data }; }
  }
}

/**
 * Setup our actual type safe objects here.
 *
 * Each service/method pair maps to a swagger operation, which we delegate to our swagger API
 */
const swaggerP = new ((window as any).SwaggerClient as any)('/api/swagger.json');

function setupOp<Service extends keyof SwaggerAPI, Op extends keyof SwaggerAPI[Service]> (service: Service, op: Op, input: DeclaredRoute<Service, Op>) {
  const actualOperation = `${inflection.camelize(service)}Service${inflection.camelize(op)}`
  return (...args: any[]) => {
    const transformedArgs = input == true ? undefined : input(...args as any);
    return swaggerP.then((swagger) => {
      return swagger.apis[service][actualOperation](transformedArgs)
      .then((result) => {
        // Do whatever we need to with the swagger result
        return result.obj;
      });
    });
  };
}
function setupService<
  Service extends keyof DeclaredRoutes
>(service: Service, api: DeclaredRoutes[Service]) {
  return reduce(
    (Object.keys(api) as Array<keyof DeclaredRoutes[Service]>),
    (memo, thisOperation) => {
      memo[thisOperation] = setupOp(service, thisOperation, api[thisOperation] as any);
      return memo;
    },
    {} as any
  );
}

function setupAPI(routes: DeclaredRoutes) {
  return reduce(
    Object.keys(routes),
    (memo, thisService: keyof DeclaredRoutes) => {
      memo[thisService] = setupService(thisService, routes[thisService])
      return memo;
    },
    {} as any
  )
}

const swagger = setupAPI(declaredRoutes);
const getSwagger = () => {
  return (swagger as SwaggerAPI);
}

export { SwaggerAPI };
export default getSwagger;