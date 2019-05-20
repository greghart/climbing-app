import withPhotoable from '../photos/withPhotoable';
import Boulder from '../../../models/Boulder';
import { fetchPhotoableForBoulder } from '../../ducks/operations/fetchPhotoable';

interface OwnProps {
  boulder: Boulder;
}
const boulderWithPhotoable = withPhotoable<OwnProps>(
  (props) => (props.boulder as any),
  fetchPhotoableForBoulder
);

export default boulderWithPhotoable;
