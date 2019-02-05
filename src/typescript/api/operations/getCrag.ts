import Crag from '../../models/Crag';
import { getRepository } from 'typeorm';

const getCrags = (id: number | string) => {
  // Crag IDs for client can also be name
  return getRepository(Crag)
  .findOne({
    where: { name: id },
    relations: ['areas', 'areas.boulders', 'areas.coordinates', 'areas.boulders.routes']
  })
  .then((crag) => {
    crag._isLoaded = true;
    return crag
  });
};

export default getCrags;
