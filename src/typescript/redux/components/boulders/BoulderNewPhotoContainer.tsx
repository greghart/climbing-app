import * as React from "react";
import Boulder from "../../../models/Boulder.js";
import NewPhotoContainer from "../photos/NewPhotoContainer.js";
import withPhotoable from "./withPhotoable.js";

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
        name: "Greg Hart",
        email: "greghartemail@gmail.com",
        photos: [],
      }}
    />
  );
};

export default BoulderNewPhotoContainer;
