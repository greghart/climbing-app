import * as React from "react";
import Route from "../../../models/Route.js";
import NewPhotoContainer from "../photos/NewPhotoContainer.js";
import withPhotoable from "./withPhotoable.js";

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
        name: "Greg Hart",
        email: "greghartemail@gmail.com",
        photos: [],
      }}
    />
  );
};

export default RouteNewPhotoContainer;
