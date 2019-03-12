import * as t from 'io-ts';
import * as types from './util';

const CragCodec = t.type({
  name: types.minLength,
  description: t.union([
    t.null,
    types.minLength,
  ]),
  trail: t.type({
    nodes: t.array(
      t.type({
        id: t.any,
        lat: t.number,
        lng: t.number,
        edges: t.array(
          t.type({
            a: t.number,
            b: t.number
          })
        )
      }),
    )
  })
});

export default CragCodec;
