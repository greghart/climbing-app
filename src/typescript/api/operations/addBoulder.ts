import { getRepository } from 'typeorm';

import Area from '../../models/Area';
import Boulder from '../../models/Boulder';
import { BoulderPayload } from '../services/BouldersService';

const addBoulder = (area: Area, data: BoulderPayload) => {
  const boulder = new Boulder();
  Object.assign(boulder, data);
  boulder.area = area;
  return getRepository(Boulder).save(boulder);
};

export default addBoulder;
