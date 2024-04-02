import { PhotoableSchema } from "../../normalizr.js";
import Photoable from "../../../models/Photoable.js";
import buildWithChild from "../util/buildWithChild.js";

const withPhotoable = buildWithChild<Photoable, { photoable?: Photoable }>(
  "photoable",
  PhotoableSchema
);

export default withPhotoable;
