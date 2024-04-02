import * as t from "io-ts";
import * as types from "./util.js";

const PhotoCodec = t.type({
  title: types.minLength,
  description: t.union([t.null, t.undefined, types.minLength]),
  file: t.UnknownRecord,
});

export default PhotoCodec;
