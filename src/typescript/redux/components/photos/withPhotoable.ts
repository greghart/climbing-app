import { PhotoableSchema } from '../../normalizr';
import Photoable from '../../../models/Photoable';
import buildWithChild from '../util/buildWithChild';

const withPhotoable = buildWithChild<Photoable, { photoable?: Photoable }>(
// const withPhotoable = buildWithChild<Photoable, 'photoable'>(
  'photoable',
  PhotoableSchema
);

export default withPhotoable;
