import * as t from 'io-ts';
import * as types from './util';

const AreaCodec = t.exact(
  t.type({
    name: types.minLength,
    description: t.union([
      t.null,
      types.minLength,
    ]),
    polygon: t.type({
      coordinates: t.array(
        t.type({
          lat: t.number,
          lng: t.number,
          order: t.number
        })
      )
    })
  })
);

export default AreaCodec;


