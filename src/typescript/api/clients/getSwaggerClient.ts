import { reduce } from "lodash-es";
import * as inflection from "inflection";

import type { APIClientInterface } from "./APIClientInterface.js";
import type { ArgumentTypes } from "../../externals.js";

/**
 * For our swagger client, we need to map our method signatures to the object
 * signature `swagger-client` expects.
 */
type DeclaredRoute<
  Service extends keyof APIClientInterface,
  Op extends keyof APIClientInterface[Service]
> =
  | true
  | (APIClientInterface[Service][Op] extends Function
      ? (
          ...args: ArgumentTypes<APIClientInterface[Service][Op]>
        ) => Object | null
      : never);
type DeclaredRoutes = {
  [Service in keyof APIClientInterface]: {
    [Op in keyof APIClientInterface[Service]]?: DeclaredRoute<Service, Op>;
  };
};
const declaredRoutes = {
  crags: {
    getCrag: (id) => {
      return { id };
    },
    exportCrag: (id) => {
      return { id };
    },
    addArea: (id, data) => {
      return { id, data };
    },
    updateCrag: (id, data) => {
      return { id, data };
    },
    getTrail: (id) => {
      return { id };
    },
  },
  areas: {
    getAreas: (ids, includeComments) => {
      return { ids, includeComments };
    },
    addBoulder: (id, data) => {
      return { id, data };
    },
    updateArea: (id, data) => {
      return { id, data };
    },
  },
  boulders: {
    getBoulder: (id, includeComments) => {
      return { id, includeComments };
    },
    addRoute: (id, data) => {
      return { id, data };
    },
    updateBoulder: (id, data) => {
      return { id, data };
    },
  },
  routes: {
    getRoute: (id, includeComments) => {
      return { id, includeComments };
    },
    updateRoute: (id, data) => {
      return { id, data };
    },
  },
  commentables: {
    getCommentable: (id) => {
      return { id };
    },
    addComment: (id, data) => {
      return { id, data };
    },
    commentableForBoulder: (id) => {
      return { id };
    },
    commentableForRoute: (id) => {
      return { id };
    },
    commentableForArea: (id) => {
      return { id };
    },
    commentableForCrag: (id) => {
      return { id };
    },
  },
  photoables: {
    addPhoto: (id, photo, title, description) => {
      return { id, photo, title, description };
    },
    photoableForRoute: (id) => {
      return { id };
    },
    photoableForBoulder: (id) => {
      return { id };
    },
    photoableForArea: (id) => {
      return { id };
    },
    photoableForCrag: (id) => {
      return { id };
    },
  },
};

/**
 * Setup our actual type safe objects here.
 *
 * Each service/method pair maps to a swagger operation, which we delegate to our swagger API
 */
const SwaggerClient = require("swagger-client");
const swaggerP = new SwaggerClient("/api/swagger.json");

function setupOp<
  Service extends keyof APIClientInterface,
  Op extends keyof APIClientInterface[Service]
>(service: Service, op: Op, input: DeclaredRoute<Service, Op>) {
  const actualOperation = `${inflection.camelize(
    service
  )}Service${inflection.camelize(op)}`;
  return (...args: any[]) => {
    const transformedArgs =
      input === true ? undefined : input(...(args as any));
    return swaggerP.then((swagger) => {
      return swagger.apis[service][actualOperation](transformedArgs).then(
        (result) => {
          // Do whatever we need to with the swagger result
          return result.obj;
        }
      );
    });
  };
}
function setupService<Service extends keyof DeclaredRoutes>(
  service: Service,
  api: DeclaredRoutes[Service]
) {
  return reduce(
    Object.keys(api) as Array<keyof DeclaredRoutes[Service]>,
    (memo, thisOperation) => {
      memo[thisOperation] = setupOp(
        service,
        thisOperation,
        api[thisOperation] as any
      );
      return memo;
    },
    {} as any
  );
}

type DeclaredAPI = {
  [Service in keyof typeof declaredRoutes]: {
    [Op in keyof (typeof declaredRoutes)[Service]]: Op extends keyof APIClientInterface[Service]
      ? APIClientInterface[Service][Op]
      : null;
  };
};
function setupAPI(routes: DeclaredRoutes) {
  return reduce(
    Object.keys(routes) as Array<keyof DeclaredRoutes>,
    (memo, thisService: keyof DeclaredRoutes) => {
      memo[thisService] = setupService(thisService, routes[thisService]);
      return memo;
    },
    {} as any
  );
}

const swagger = setupAPI(declaredRoutes);
const getSwaggerClient = () => {
  return swagger as DeclaredAPI;
};

export type { DeclaredAPI as APIClientInterface };
export default getSwaggerClient;
