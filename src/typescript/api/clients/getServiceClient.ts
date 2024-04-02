import * as Rest from "typescript-rest";
import { isFunction } from "lodash-es";

import type { APIClientInterface } from "./getSwaggerClient.js";
import CragsService from "../services/CragsService.js";
import AreasService from "../services/AreasService.js";
import BouldersService from "../services/BouldersService.js";
import RoutesService from "../services/RoutesService.js";
import CommentablesService from "../services/CommentablesService.js";
import PhotoablesService from "../services/PhotoablesService.js";

function isNewResource<T>(
  result: T | Rest.Return.NewResource<T>
): result is Rest.Return.NewResource<T> {
  return !!(result as Rest.Return.NewResource<T>).body;
}

function unwrapNewResource<T>(result: Rest.Return.NewResource<T>) {
  return result.body;
}

function unwrapNewResourceFunction<T, Args>(
  method: (...args: Args[]) => T | Rest.Return.NewResource<T>
): (...args: Args[]) => T {
  return (...args: Args[]) => {
    const result = method(...args);
    if (isNewResource(result)) {
      return result.body;
    }
    return result;
  };
}

function unwrapNewResourceObject(obj: {}) {
  const result = {};
  for (const thisKey in obj) {
    if (isFunction(obj[thisKey])) {
      result[thisKey] = unwrapNewResourceFunction(obj[thisKey]);
    }
  }
  return result;
}

let _singleton: APIClientInterface;
/**
 * For our service client, we will construct and delegate to our service classes
 * directly.
 */
function getServiceClient(): APIClientInterface {
  if (_singleton) {
    return _singleton;
  }
  _singleton = {
    crags: unwrapNewResourceObject(new CragsService()),
    areas: unwrapNewResourceObject(new AreasService()),
    boulders: unwrapNewResourceObject(new BouldersService()),
    routes: unwrapNewResourceObject(new RoutesService()),
    commentables: unwrapNewResourceObject(new CommentablesService()),
    photoables: unwrapNewResourceObject(new PhotoablesService()),
  } as APIClientInterface;
  return _singleton;
}

export default getServiceClient;
