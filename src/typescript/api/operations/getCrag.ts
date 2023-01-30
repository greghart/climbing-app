import myDataSource from "../../db/myDataSource";
import Crag from "../../models/Crag";

const getCrag = (id: number | string) => {
  // Crag IDs for client can also be name
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
