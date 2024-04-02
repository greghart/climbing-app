import * as React from "react";

import OverlayDetail from "./OverlayDetail.js";
import Route from "../../../models/Route.js";
import Crag from "../../../models/Crag.js";
import withRoute from "../routes/withRoute.js";
import Truncate from "../Truncate.js";
import Coordinate from "../../../models/Coordinate.js";

type NeededProps = "id" | "name" | "gradeRaw" | "description" | "coordinate";
interface Props {
  crag: Crag;
  route: Pick<Route, NeededProps>;
}

const RouteOverlayContent: React.FunctionComponent<Props> = (props) => {
  return (
    <React.Fragment>
      <p>
        <Truncate length={180} text={props.route.description} />
      </p>
    </React.Fragment>
  );
};

const RouteOverlay: React.FunctionComponent<Props> = (props) => {
  return (
    <OverlayDetail
      header={`${props.route.name} (${props.route.gradeRaw})`}
      linkTo={`/routes/${props.route.id}`}
      content={<RouteOverlayContent {...props} />}
    />
  );
};

RouteOverlay.defaultProps = {
  route: {
    id: 1,
    name: "Sample Route",
    gradeRaw: "V7",
    coordinate: new Coordinate(1, 2),
  },
};

const ConnectedRouteOverlay = withRoute()(RouteOverlay);
export { ConnectedRouteOverlay };
export default RouteOverlay;
