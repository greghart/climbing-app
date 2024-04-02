import myDataSource from "../../db/myDataSource.js";

import PolygonCoordinate from "../../models/PolygonCoordinate.js";
import Polygon from "../../models/Polygon.js";

/**
 *
 * @param coordinates Coordinates of polygon, should be in order, or have order
 */
const setPolygon = async (
  polygon: Polygon,
  coordinates: { lat: number; lng: number; order?: number }[]
) => {
  const polygonCoordinates = coordinates.map((thisCoordinate, i) => {
    const pc = new PolygonCoordinate(thisCoordinate.lat, thisCoordinate.lng);
    pc.order = thisCoordinate.order || i;
    return pc;
  });
  const queryRunner = myDataSource.createQueryRunner();
  // await queryRunner.startTransaction();
  // Remove old coordinates, if any, and add new ones
  if (polygon.id) {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(PolygonCoordinate)
      .where("polygon = :id", { id: polygon.id })
      .execute();
  }
  polygon.coordinates = polygonCoordinates;
  return myDataSource.getRepository(Polygon).save(polygon);
  // commit transaction now:
  // await queryRunner.commitTransaction();
};

export default setPolygon;
