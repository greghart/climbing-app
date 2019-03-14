import * as React from 'react';
import omit = require('lodash/omit');

import Route from '../../../models/Route';
import withPhotoable from './withPhotoable';
import ShowPhotoable from '../photos/ShowPhotoable';
import withRoute from './withRoute';

interface OwnProps {
  myRoute: Route;
}

// const Container = withPhotoable()(
//   withRoute(
//     ShowPhotoable,
//     { photoable: true }
//   )
// );
const Container = withPhotoable(ShowPhotoable);
// const Container = withRoute(
//   withPhotoable()(ShowPhotoable),
//   { photoable: true }
// );

const RoutePhotosContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      newRoute={`/routes/${props.myRoute.id}/photos/new`}
    />
  );
};

export default RoutePhotosContainer;
