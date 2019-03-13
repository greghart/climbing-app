import * as t from 'io-ts';
import * as types from './util';
import GraphCodec from './GraphCodec';

const CragCodec = t.type({
  name: types.minLength,
  description: t.union([
    t.null,
    types.minLength,
  ]),
  trail: GraphCodec
});

export default CragCodec;
