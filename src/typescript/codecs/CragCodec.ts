import * as t from 'io-ts';
import * as types from './util';

const CragCodec = t.type({
  name: types.minLength,
  description: t.union([
    t.null,
    types.minLength,
  ]),
});

export default CragCodec;
