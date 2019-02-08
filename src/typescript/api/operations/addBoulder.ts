import * as t from 'io-ts';
import { getRepository } from 'typeorm';
import omit = require('lodash/omit');

import Area from '../../models/Area';
import Boulder from '../../models/Boulder';
import BoulderCodec from '../../codecs/BoulderCodec';
import Polygon from '../../models/Polygon';
import setPolygon from './setPolygon';

const addBoulder = async (area: Area, data: t.TypeOf<typeof BoulderCodec>) => {
  // Setup boulder
  const boulder = new Boulder();
  Object.assign(boulder, omit(data, 'polygon'));
  boulder.area = area;

  const savedBoulder = await getRepository(Boulder).save(boulder);
  // Setup polygon if we have one
  if (data.polygon) {
    const polygon = new Polygon();
    polygon.descriptor = `boulder-${savedBoulder.id}`;
    await setPolygon(polygon, data.polygon.coordinates);
    savedBoulder.polygon = polygon;
    return getRepository(Boulder).save(savedBoulder);
  }
  return savedBoulder;
};

export default addBoulder;
