import * as t from "io-ts";

import myDataSource from "../../db/myDataSource.js";
import Crag from "../../models/Crag.js";
import Area from "../../models/Area.js";
import setPolygon from "./setPolygon.js";
import Polygon from "../../models/Polygon.js";
import AreaCodec from "../../codecs/AreaCodec.js";

const addArea = async (crag: Crag, data: t.TypeOf<typeof AreaCodec>) => {
  // Setup area
  const area = new Area();
  Object.assign(area, data);
  area.crag = crag;

  // Setup a saved polygon first
  if (data.polygon) {
    const polygon = new Polygon();
    polygon.descriptor = "area-new";
    await setPolygon(polygon, data.polygon.coordinates);
    area.polygon = polygon;
  }
  const savedArea = await myDataSource.getRepository(Area).save(area);
  if (data.polygon) {
    area.polygon.descriptor = `area-${savedArea.id}`;
    await myDataSource.getRepository(Polygon).save(area.polygon);
  }
  return savedArea;
};

export default addArea;
