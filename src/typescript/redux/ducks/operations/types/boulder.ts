import * as t from 'io-ts';
import * as types from './util';

const BoulderType = t.type({
  name: types.minLength,
  description: t.union([
    t.null,
    types.minLength,
  ])
});

export default BoulderType;

