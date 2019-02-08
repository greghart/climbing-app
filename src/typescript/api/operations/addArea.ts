import { getRepository, getCustomRepository } from 'typeorm';

import Crag from '../../models/Crag';
import Area from '../../models/Area';
import { AreaPayload } from '../services/AreasService';
import setPolygon from './setPolygon';
import Polygon from '../../models/Polygon';

const addArea = async (crag: Crag, data: AreaPayload) => {
  // Catch-22 an area _needs_ a polygon, cause that's kind of the business case.
  // But a polygon is not really able to be setup with the right descriptor
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

