import withPhotoable from '../photos/withPhotoable';
import Route from '../../../models/Route';
import { fetchPhotoableForRoute } from '../../ducks/operations/fetchPhotoable';

interface OwnProps {
  myRoute: Route;
}
const routeWithPhotoable = withPhotoable<OwnProps>(
  (props) => props.myRoute,
  fetchPhotoableForRoute
);

export default routeWithPhotoable;
