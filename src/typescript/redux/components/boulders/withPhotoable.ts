import withPhotoable from "../photos/withPhotoable.js";
import Boulder from "../../../models/Boulder.js";
import { fetchPhotoableForBoulder } from "../../ducks/operations/fetchPhotoable.js";

interface OwnProps {
  boulder: Boulder;
}
const boulderWithPhotoable = withPhotoable<OwnProps>(
  (props) => props.boulder as any,
  fetchPhotoableForBoulder
);

export default boulderWithPhotoable;
