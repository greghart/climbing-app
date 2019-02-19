import * as t from 'io-ts';
import { getRepository } from 'typeorm';

import Crag from '../../models/Crag';
import Area from '../../models/Area';
import setPolygon from './setPolygon';
import Polygon from '../../models/Polygon';
import AreaCodec from '../../codecs/AreaCodec';

const addArea = async (crag: Crag, data: t.TypeOf<typeof AreaCodec>) => {
  // Setup area
  const area = new Area();
  Object.assign(area, data);
  area.crag = crag;

  // Setup a saved polygon first
  if (data.polygon) {
    const polygon = new Polygon();
    polygon.descriptor = 'area-new';
    await setPolygon(polygon, data.polygon.coordinates);
    area.polygon = polygon;
  }
  const savedArea = await getRepository(Area).save(area);
  if (data.polygon) {
    area.polygon.descriptor = `area-${savedArea.id}`;
    await getRepository(Polygon).save(area.polygon);
  }
  return savedArea;
};

export default addArea;
