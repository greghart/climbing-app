import * as t from 'io-ts';
import * as types from './util';
import GraphCodec from './GraphCodec';
import BoundsCodec from './BoundsCodec';

const CragCodec = t.type({
  name: types.minLength,
  description: t.union([
    t.null,
    types.minLength,
  ]),
  trail: t.union([
    t.undefined,
    GraphCodec
  ]),
  bounds: t.union([
    t.undefined,
    BoundsCodec
  ])
});

export default CragCodec;
