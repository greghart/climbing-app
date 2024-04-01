import myDataSource from "../../db/myDataSource";
import Crag from "../../models/Crag";

/**
 * Export all of a crag's information
 */
const exportCrag = (id: number | string) => {
  // Crag IDs for client can also be name
  return myDataSource
    .getRepository(Crag)
    .findOne({
      where: [{ name: id as string }, { id: id as number }],
      relations: [
        "areas",
        "areas.polygon",
        "areas.polygon.coordinates",
        "areas.boulders",
        "areas.boulders.polygon",
        "areas.boulders.polygon.coordinates",
        "areas.boulders.routes",
      ],
    })
    .then((crag) => {
      if (crag) crag._isLoaded = true;
      return crag;
    });
};

export default exportCrag;
