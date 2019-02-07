import { getRepository } from 'typeorm';

import Crag from '../../models/Crag';
import Area from '../../models/Area';
import { AreaPayload } from '../services/AreasService';

const addArea = (crag: Crag, data: AreaPayload) => {
  const area = new Area();
  Object.assign(area, data);
  area.crag = crag;
  return getRepository(Area).save(area);
};

export default addArea;

