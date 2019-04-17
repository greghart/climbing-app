import * as t from 'io-ts';
import { getConnection, getCustomRepository } from 'typeorm';
import omit from 'lodash/omit';

import Area from '../../models/Area';
import AreaCodec from '../../codecs/AreaCodec';
import setPolygon from './setPolygon';
import PolygonRepository from '../../models/repositories/PolygonRepository';

const updateArea = async (area: Area, data: t.TypeOf<typeof AreaCodec>) => {
  return (await getConnection()).transaction((transactionalEntityManager) => {
    return Promise.resolve()
    // Setup polygon if necessary
    .then(async () => {
      if (data.polygon) {
        return setPolygon(
          await getCustomRepository(PolygonRepository).findOrGetPolygon(area),
          data.polygon.coordinates,
        );
      }
    })
    .then(() => {
      Object.assign(area, omit(data, 'polygon'));
      return transactionalEntityManager.save(area);
    });
  });
};

export default updateArea;
