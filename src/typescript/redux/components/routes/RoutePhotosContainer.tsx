import * as React from "react";

import Route from "../../../models/Route.js";
import withPhotoable from "./withPhotoable.js";
import ShowPhotoable from "../photos/ShowPhotoable.js";

interface OwnProps {
  myRoute: Route;
}

const Container = withPhotoable(ShowPhotoable);

const RoutePhotosContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container {...props} newRoute={`/routes/${props.myRoute.id}/photos/new`} />
  );
};

export default RoutePhotosContainer;
