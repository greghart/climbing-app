import * as t from 'io-ts';

const GraphEdgeCodec = t.type({
  a: t.number,
  b: t.number
});

export default GraphEdgeCodec;
