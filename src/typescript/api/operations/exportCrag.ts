import { getRepository } from 'typeorm';
import Crag from '../../models/Crag';

/**
 * Export all of a crag's information
 */
const exportCrag = (id: number | string) => {
  // Crag IDs for client can also be name
  return getRepository(Crag)
  .findOne({
    where: [
      { name: id },
      { id },
    ],
    relations: [
      'areas',
      'areas.polygon',
      'areas.polygon.coordinates',
      'areas.boulders',
      'areas.boulders.polygon',
      'areas.boulders.polygon.coordinates',
      'areas.boulders.routes',
    ],
  })
  .then((crag) => {
    crag._isLoaded = true;
    return crag;
  });
};

export default exportCrag;
