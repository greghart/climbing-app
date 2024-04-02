import * as t from "io-ts";
import GraphNodeCodec from "./GraphNodeCodec.js";

const GraphCodec = t.type({
  nodes: t.array(GraphNodeCodec),
});

export default GraphCodec;
