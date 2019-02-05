import * as t from 'io-ts';
import { getConnection } from 'typeorm';
import Area from '../../models/Area';
import AreaCodec from '../../codecs/AreaCodec';

const updateArea = async (area: Area, data: t.TypeOf<typeof AreaCodec>) => {
  return (await getConnection()).transaction((transactionalEntityManager) => {
    return Promise.resolve()
    // Remove old coordinates if necessary
    .then(() => {
      if (data.coordinates) {
        return transactionalEntityManager.remove(area.coordinates);
      }
    })
    .then(() => {
      Object.assign(area, data)
      return transactionalEntityManager.save(area);
    });
  });
};

export default updateArea;
