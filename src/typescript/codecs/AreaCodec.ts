import * as t from 'io-ts';
import * as types from './util';
import PolygonCodec from './PolygonCodec';

const AreaCodec = t.exact(
  t.type({
    name: types.minLength,
    description: t.union([
      t.null,
      t.undefined,
      types.minLength,
    ]),
    polygon: PolygonCodec
  })
);

export default AreaCodec;


