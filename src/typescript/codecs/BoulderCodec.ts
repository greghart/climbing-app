import * as t from "io-ts";
import * as types from "./util.js";
import PolygonCodec from "./PolygonCodec.js";

const BoulderCodec = t.type({
  name: types.minLength,
  description: t.union([t.undefined, t.null, types.minLength]),
  coordinate: t.type({
    lat: t.number,
    lng: t.number,
  }),
  polygon: t.union([PolygonCodec, t.undefined]),
});

export default BoulderCodec;
