import * as Rest from "typescript-rest";
import * as Swagger from "typescript-rest-swagger";

import myDataSource from "../../db/myDataSource";
import Polygon from "../../models/Polygon";
import PolygonRepository from "../../models/repositories/PolygonRepository";
import getArea from "../operations/getArea";

const getPolygon = (id: number) => {
  return myDataSource.getRepository(Polygon).findOne({
    where: { id: id as number },
    relations: ["coordinates"],
  });
};

/**
 * Polygons service
 */
@Rest.Path("/polygons")
export default class PolygonsService {
  @Rest.GET
  @Rest.Path(":id")
  @Swagger.Tags("polygons")
  @Swagger.Response<object>(200, "Get data for a polygon")
  public async getPolygon(@Rest.PathParam("id") id: string) {
    return getPolygon(parseInt(id));
  }

  // @Rest.GET
  // @Rest.Path('/boulder/:id')
  // @Swagger.Tags('polygons')
  // @Swagger.Response<object>(302, 'Get the polygon for a boulder')
  // public async polygonForBoulder(
  //   @Rest.PathParam('id') id: string
  // ) {
  //   return getBoulder(id)
  //   .then((boulder) => {
  //     return getCustomRepository(PolygonRepository).findOrGetPolygon(boulder)
  //   })
  //   .then((polygon) => {
  //     return getPolygons(polygon.id);
  //   });
  // }

  @Rest.GET
  @Rest.Path("/area/:id")
  @Swagger.Tags("polygons")
  @Swagger.Response<object>(302, "Get the polygon for a area")
  public async polygonForArea(@Rest.PathParam("id") id: string) {
    return getArea(id)
      .then((area) => {
        return myDataSource.manager
          .withRepository(PolygonRepository)
          .findOrGetPolygon(area);
      })
      .then((polygon) => {
        return getPolygon(polygon.id);
      });
  }

  // @Rest.GET
  // @Rest.Path('/crag/:id')
  // @Swagger.Tags('polygons')
  // @Swagger.Response<object>(302, 'Get the polygon for a crag')
  // public async polygonForCrag(
  //   @Rest.PathParam('id') id: string
  // ) {
  //   return getRepository(Crag).findOne(id)
  //   .then((crag) => {
  //     return getCustomRepository(PolygonRepository).findOrGetPolygon(crag)
  //   })
  //   .then((polygon) => {
  //     return getPolygons(polygon.id);
  //   });
  // }

  // @Rest.POST
  // @Rest.Path(':id/coordinates')
  // @Swagger.Tags('polygons')
  // @Swagger.Response<object>(201, 'Set a polygon for a polygon')
  // public async setPolygon(
  //   @Rest.PathParam('id') id: string,
  //   data: PolygonPayload
  // ) {
  //   const polygon = await getRepository(Polygon).findOne(id);
  //   return setPolygon(
  //     polygon,
  //     data.coordinates
  //   )
  //   .then((newCoordinates) => {
  //     polygon.coordinates = newCoordinates;
  //     return new Rest.Return.NewResource(`/polygons/${polygon.id}`, polygon)
  //   })
  // }
}

type PolygonsServiceType = typeof PolygonsService.prototype;
export type { PolygonsServiceType };
