import * as t from 'io-ts';
import { getRepository, getConnection, getCustomRepository } from 'typeorm';
import omit from 'lodash/omit';

import Crag from '../../models/Crag';
import CragCodec from '../../codecs/CragCodec';
import setTrail from './setTrail';
import TrailRepository from '../../models/repositories/TrailRepository';
import Coordinate from '../../models/Coordinate';
import Bounds from '../../models/Bounds';
import _debug from '../../debug';
const debug = _debug.extend('api:operations:updateCrag');

const updateCrag = async (crag: Crag, data: t.TypeOf<typeof CragCodec>) => {
  console.warn({ data }, 'updateCrag');
  return (await getConnection()).transaction((transactionalEntityManager) => {
    return Promise.resolve()
    // Setup trail if necessary
    .then(async () => {
      if (data.trail) {
        console.warn('setting trail');
        return setTrail(
          await getCustomRepository(TrailRepository).findOrGetTrail(crag),
          data.trail.nodes,
        );
      }
    })
    // Setup bounds if necessary
    .then(async () => {
      if (!data.bounds) {
        return;
      }
      const bounds = crag.bounds || new Bounds();
      bounds.topLeft = new Coordinate(
        data.bounds.topLeft.lat,
        data.bounds.topLeft.lng
      );
      bounds.bottomRight = new Coordinate(
        data.bounds.bottomRight.lat,
        data.bounds.bottomRight.lng
      );
      bounds.crag = crag;
      await transactionalEntityManager.save(bounds);
      delete bounds.crag;
      crag.bounds = bounds;
    })
    .then(() => {
      Object.assign(crag, omit(data, 'trail', 'bounds'));
      debug({ crag }, 'save');
      return transactionalEntityManager.save(crag);
    });
  });
};

export default updateCrag;
