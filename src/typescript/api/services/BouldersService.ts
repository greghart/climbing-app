import * as Rest from "typescript-rest";
import { Tags, Response } from "typescript-rest-swagger";

import getBoulder from "../operations/getBoulder.js";
import addRoute from "../operations/addRoute.js";
import type { RoutePayload } from "./RoutesService.js";
import validate from "../util/validate.js";
import BoulderCodec from "../../codecs/BoulderCodec.js";
import updateBoulder from "../operations/updateBoulder.js";

// Payload for boulder data
interface BoulderPayload {
  name: string;
  description?: string;
}

/**
 * Climbing boulders service.
 */
@Rest.Path("/boulders")
export default class BouldersService {
  @Rest.GET
  @Rest.Path(":id")
  @Tags("boulders")
  @Response<object>(200, "Get data on a climbing boulder")
  public async getBoulder(
    @Rest.PathParam("id") id: string,
    @Rest.QueryParam("includeComments") includeComments?: boolean
  ) {
    return getBoulder(id, { includeComments });
  }

  @Rest.POST
  @Rest.Path(":id/routes")
  @Tags("boulders")
  @Response<RoutePayload>(201, "Add a route to a boulder")
  public async addRoute(
    // Routes must be added to a boulder currently
    @Rest.PathParam("id") id: string,
    data: RoutePayload
  ) {
    const boulder = await getBoulder(id);
    return addRoute(boulder, data).then((route) => {
      return new Rest.Return.NewResource(`/boulders/${boulder.id}`, route);
    });
  }

  @Rest.PUT
  @Rest.Path(":id")
  @Tags("boulders")
  @Response<BoulderPayload>(200, "Update a boulder")
  public async updateBoulder(
    @Rest.PathParam("id") id: string,
    data: BoulderPayload
  ) {
    const boulder = await getBoulder(id);
    const payload = await validate(data, BoulderCodec);
    return updateBoulder(boulder, payload);
  }
}

type BouldersServiceType = typeof BouldersService.prototype;
export type { BouldersServiceType };
export type { BoulderPayload };
