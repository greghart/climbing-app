import * as React from 'react';
import Route from '../../../models/Route';
import NewPhotoContainer from '../photos/NewPhotoContainer';
import withPhotoable from './withPhotoable';

interface OwnProps {
  myRoute: Route;
}
const Container = withPhotoable(NewPhotoContainer);

const RouteNewPhotoContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      redirect={`/routes/${props.myRoute.id}/photos`}
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

export default RouteNewPhotoContainer;
