import * as React from "react";
import { Map } from "react-leaflet";

import Coordinate, { isValidCoordinate } from "../../../models/Coordinate.js";
import BestTileLayer from "../BestTileLayer.js";
import BoulderIcon from "../map/BoulderIcon.js";

interface Props {
  coordinate: Partial<Coordinate>;
  left?: (props: Props) => React.ReactNode;
}

const defaultLeft = (props: Props) =>
  isValidCoordinate(props.coordinate) ? (
    <span>
      {props.coordinate.lat} x {props.coordinate.lng}
    </span>
  ) : (
    "No coordinate"
  );

/**
 * Display a coordinate, if it exists, in a simple side by side layout of lat lng and map
 */
const CoordinateMap: React.ComponentType<Props> = (props) => {
  const coordinate = props.coordinate;
  return (
    <div className="row">
      <div className="col-6">{props.left(props)}</div>
      <div className="col" style={{ width: "100%", height: "125px" }}>
        {isValidCoordinate(coordinate) && (
          <Map
            className="h-100"
            center={coordinate}
            zoom={18}
            zoomControl={false}
          >
            <BestTileLayer />
            <BoulderIcon position={coordinate} />
          </Map>
        )}
      </div>
    </div>
  );
};

CoordinateMap.defaultProps = {
  left: defaultLeft,
};

export default CoordinateMap;
