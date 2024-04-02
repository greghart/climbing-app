import withPhotoable from "../photos/withPhotoable.js";
import Route from "../../../models/Route.js";
import { fetchPhotoableForRoute } from "../../ducks/operations/fetchPhotoable.js";

interface OwnProps {
  myRoute: Route;
}
const routeWithPhotoable = withPhotoable<OwnProps>(
  (props) => props.myRoute,
  fetchPhotoableForRoute
);

export default routeWithPhotoable;
