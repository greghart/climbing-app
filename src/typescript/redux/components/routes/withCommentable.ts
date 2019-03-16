import { fetchCommentableForRoute } from '../../ducks/operations/fetchCommentable';
import Route from '../../../models/Route';
import withCommentable from '../comments/withCommentable';

interface OwnProps {
  myRoute: Route;
}

const routeWithCommentable = withCommentable<OwnProps>(
  (props) => props.myRoute,
  fetchCommentableForRoute
);

export default routeWithCommentable;
