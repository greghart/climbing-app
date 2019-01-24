import Crag from '../../models/Crag';
import { getRepository } from 'typeorm';

const getCrags = () => {
  return getRepository(Crag).find({
    relations: ['areas', 'areas.boulders', 'areas.coordinates', 'areas.boulders.routes']
  });
};

export default getCrags;
