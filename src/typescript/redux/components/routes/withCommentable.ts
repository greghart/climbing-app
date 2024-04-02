import { fetchCommentableForRoute } from "../../ducks/operations/fetchCommentable.js";
import Route from "../../../models/Route.js";
import withCommentable from "../comments/withCommentable.js";

interface OwnProps {
  myRoute: Route;
}

const routeWithCommentable = withCommentable<OwnProps>(
  (props) => props.myRoute,
  fetchCommentableForRoute
);

export default routeWithCommentable;
