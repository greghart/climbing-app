import * as t from 'io-ts';
import GraphEdgeCodec from './GraphEdgeCodec';

const GraphNodeCodec = t.type({
  id: t.any,
  lat: t.number,
  lng: t.number,
  edges: t.array(GraphEdgeCodec)
});

export default GraphNodeCodec;
