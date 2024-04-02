import * as React from "react";
import type { Omit } from "utility-types";

import PhotoModel from "../../../models/Photo.js";
import User from "../../../models/User.js";

type Base = Omit<PhotoModel, "photoable">;

interface Props {
  photo: Base;
  user: User;
}

/**
 * Just the photo image that tries to fit into its' given bounds
 * Ie. you must size it in parent
 */
const PhotoImage: React.SFC<Props> = (props) => {
  return (
    <img
      style={{
        objectFit: "cover",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "150px",
      }}
      src={`/uploads/${props.photo.upload.id}/download`}
    />
  );
};

PhotoImage.defaultProps = {};

export default PhotoImage;
