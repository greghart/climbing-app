import * as t from 'io-ts';
import * as types from './util';
import PolygonCodec from './PolygonCodec';

const BoulderCodec = t.type({
  name: types.minLength,
  description: t.union([
    t.undefined,
    t.null,
    types.minLength,
  ]),
  coordinate: t.type({
    lat: t.number,
    lng: t.number,
  }),
  polygon: t.union([
    PolygonCodec,
    t.undefined
  ])
});

export default BoulderCodec;
