import * as React from 'react';
import Boulder from '../../../models/Boulder';
import NewPhotoContainer from '../photos/NewPhotoContainer';
import withPhotoable from './withPhotoable';

interface OwnProps {
  boulder: Boulder;
}
const Container = withPhotoable(NewPhotoContainer);

const BoulderNewPhotoContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      redirect={`/boulders/${props.boulder.id}/photos`}
      // TODO user-feature
      user={{
        id: 1,
        name: 'Greg Hart',
        email: 'greghartemail@gmail.com',
        photos: [],
      }}
    />
  );
};

export default BoulderNewPhotoContainer;
