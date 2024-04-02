import * as t from "io-ts";
import * as types from "./util.js";
import GraphCodec from "./GraphCodec.js";
import BoundsCodec from "./BoundsCodec.js";

const CragCodec = t.type({
  name: types.minLength,
  description: t.union([t.null, types.minLength]),
  trail: t.union([t.undefined, GraphCodec]),
  bounds: t.union([t.undefined, BoundsCodec]),
});

export default CragCodec;
