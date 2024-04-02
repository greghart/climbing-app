import * as t from "io-ts";
import * as types from "./util.js";
import PolygonCodec from "./PolygonCodec.js";

const AreaCodec = t.exact(
  t.type({
    name: types.minLength,
    description: t.union([t.null, t.undefined, types.minLength]),
    polygon: PolygonCodec,
  })
);

export default AreaCodec;
