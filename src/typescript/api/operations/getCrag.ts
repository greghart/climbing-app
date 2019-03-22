import { getRepository } from 'typeorm';
import Crag from '../../models/Crag';

const getCrags = (id: number | string) => {
  // Crag IDs for client can also be name
  return getRepository(Crag)
  .findOne({
    where: [
      { name: id },
      { id },
    ],
    relations: [
      'bounds',
      'areas',
      'areas.polygon',
      'areas.polygon.coordinates',
    ],
  })
  .then((crag) => {
    crag._isLoaded = true;
    return crag;
  });
};

export default getCrags;
