import * as t from 'io-ts';
import { getRepository, getConnection, getCustomRepository } from 'typeorm';
import omit = require('lodash/omit');

import Crag from '../../models/Crag';
import CragCodec from '../../codecs/CragCodec';
import setTrail from './setTrail';
import TrailRepository from '../../models/repositories/TrailRepository';

const updateCrag = async (crag: Crag, data: t.TypeOf<typeof CragCodec>) => {
  return (await getConnection()).transaction((transactionalEntityManager) => {
    return Promise.resolve()
    // Setup trail if necessary
    .then(async () => {
      if (data.trail) {
        return setTrail(
          await getCustomRepository(TrailRepository).findOrGetTrail(crag),
          data.trail.nodes,
        );
      }
    })
    .then(() => {
      Object.assign(crag, omit(data, 'trail'));
      return transactionalEntityManager.save(crag);
    });
  });
};

export default updateCrag;
