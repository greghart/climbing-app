import myDataSource from "../../db/myDataSource.js";
import Crag from "../../models/Crag.js";

const getCrag = (id: number | string) => {
  // Crag IDs for client can also be name
  console.log("getCrag", id);
  return myDataSource
    .getRepository(Crag)
    .findOne({
      where: [{ name: id as string }, { id: id as number }],
      relations: [
        "bounds",
        "areas",
        "areas.polygon",
        "areas.polygon.coordinates",
      ],
    })
    .then((crag) => {
      if (!crag) return;
      crag._isLoaded = true;
      return crag;
    });
};

export default getCrag;
