import * as React from "react";

import Boulder from "../../../models/Boulder.js";
import withPhotoable from "./withPhotoable.js";
import ShowPhotoable from "../photos/ShowPhotoable.js";

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
