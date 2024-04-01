import * as React from "react";
import type { Omit } from "utility-types";
import { Link } from "react-router-dom";
import Photoable from "../../../models/Photoable";
import PhotoModel from "../../../models/Photo";
import PhotoImage from "./PhotoImage";

interface Props {
  // A path to creating a new photo for this entity
  newRoute: string;
  photoable: Omit<Photoable, "photos"> & {
    photos: Omit<PhotoModel, "photoable">[];
  };
}

const ShowPhotoable: React.SFC<Props> = (props) => {
  console.warn({ props }, "ShowPhotos");
  return (
    <div>
      <ul className="list-group list-group-flush">
        {props.photoable.photos.length === 0 && (
          <li className="list-group-item">No photos yet. Be the first one!</li>
        )}
        <li className="list-group-item">
          <Link to={props.newRoute} className="btn btn-primary">
            Add Photo
          </Link>
        </li>
        {props.photoable.photos.map((thisPhoto) => {
          return (
            <li className="list-group-item">
              <PhotoImage
                key={thisPhoto.id}
                photo={thisPhoto}
                user={thisPhoto.user}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ShowPhotoable;
