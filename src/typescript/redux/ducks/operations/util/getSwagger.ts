import * as inflection from 'inflection';
import reduce = require('lodash/reduce');

import { CragsServiceType } from "../../../../api/services/CragsService";
import { RoutesServiceType } from '../../../../api/services/RoutesService';

/**
 * Setup a type-safe swagger client
 */

/**
 * Some very helpful types to extract just methods from our services (just in case)
 * https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
 */
type FilterFlags<Base, Condition> = {
  [Key in keyof Base]:
      Base[Key] extends Condition ? Key : never
};
type AllowedNames<Base, Condition> =
        FilterFlags<Base, Condition>[keyof Base]
type SubType<Base, Condition> =
        Pick<Base, AllowedNames<Base, Condition>>

interface SwaggerAPI {
  crags: SubType<CragsServiceType, Function>,
  routes: SubType<RoutesServiceType, Function>
}

/**
 * We must manually declare our operations, as we want to skip a codegen step and
 * can't use transformers consistently or easily.
 */
type DeclaredRoutes = {
  [K in keyof SwaggerAPI]: Array<keyof SwaggerAPI[K]>
}
const declaredRoutes: DeclaredRoutes = {
  crags: ['getCrags'],
  routes: ['addComment', 'getRoute']
};

/**
 * Setup our actual type safe objects here.
 *
 * Each service/method pair maps to a swagger operation, which we delegate to our swagger API
 */
const swaggerP = new ((window as any).SwaggerClient as any)('/api/swagger.json');

function setupService<
  Service extends keyof DeclaredRoutes
>(service: Service, operations: DeclaredRoutes[Service]) {
  return reduce(operations,
    (memo, thisOperation) => {
      const actualOperation = `${inflection.camelize(service)}${inflection.camelize(thisOperation)}`
      memo[thisOperation] = (...args: any[]) => {
        return swaggerP.then((swagger) => {
          return swagger[service][actualOperation](args)
        })
      }
      return memo;
    },
    {}
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

export default getSwagger;
