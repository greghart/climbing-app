import * as React from 'react';
import omit = require('lodash/omit');

import Boulder from '../../../models/Boulder';
import withPhotoable from './withPhotoable';
import ShowPhotoable from '../photos/ShowPhotoable';

interface OwnProps {
  boulder: Boulder;
}

const Container = withPhotoable(ShowPhotoable);

const BoulderPhotosContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      newRoute={`/boulders/${props.boulder.id}/photos/new`}
    />
  );
};

export default BoulderPhotosContainer;
