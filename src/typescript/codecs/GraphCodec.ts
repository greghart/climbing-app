import * as t from 'io-ts';
import GraphNodeCodec from './GraphNodeCodec';

const GraphCodec = t.type({
  nodes: t.array(GraphNodeCodec)
});

export default GraphCodec;
