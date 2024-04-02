import * as React from "react";
import { reduce } from "lodash";

import OverlayDetail from "./OverlayDetail.js";
import Area from "../../../models/Area.js";
import Crag from "../../../models/Crag.js";
import withArea from "../areas/withArea.js";
import Truncate from "../Truncate.js";
import RoutesDifficultyBreakdown from "../charts/RoutesDifficultyBreakdown.js";

type NeededProps = "id" | "name" | "description" | "boulders";
interface Props {
  crag: Crag;
  area: Pick<Area, NeededProps>;
}

const AreaOverlayContent: React.FunctionComponent<Props> = (props) => {
  return (
    <React.Fragment>
      <p>
        <Truncate length={80} text={props.area.description} />
      </p>
      <RoutesDifficultyBreakdown
        routes={reduce(
          props.area.boulders,
          (memo, thisBoulder) => {
            return memo.concat(thisBoulder.routes || []);
          },
          []
        )}
        height="135px"
      />
    </React.Fragment>
  );
};

const AreaOverlay: React.FunctionComponent<Props> = (props) => {
  console.warn({ props }, "AreaOverlay");
  return (
    <OverlayDetail
      header={props.area.name}
      linkTo={`/areas/${props.area.id}`}
      content={<AreaOverlayContent {...props} />}
    />
  );
};

AreaOverlay.defaultProps = {
  area: {
    id: 1,
    name: "Sample Area",
    description: "An area of some sort",
    boulders: [],
  },
};

const ConnectedAreaOverlay = withArea(AreaOverlay);
export { ConnectedAreaOverlay };
export default AreaOverlay;
