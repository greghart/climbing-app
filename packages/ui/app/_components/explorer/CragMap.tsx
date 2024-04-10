import { useMapEvent } from "react-leaflet/hooks";
import { Crag } from "models";
import Map from "../map/Map";

// import BestTileLayer from "../BestTileLayer.js";
// import Crag from "../../../models/Crag.js";
// import Area from "../../../models/Area.js";
// import RouteContext from "../../context/RouteContext.js";
// import type { MyRouteConfig } from "../../routes/MyRouteConfig.js";

interface Props {
  crag: Crag;
  children: React.ReactNode;
}

export default function CragMap(props: Props) {
  return (
    // <AnimationContext.Consumer>
    //   {animation => (
    //     <SlideUp {...animation} appear>
    <Map bounds={props.crag.bounds} center={props.crag.center}>
      <ClickHandler />
      {props.children}
    </Map>
  );
}

interface ClickHandlerProps {
  // onAreaClick?: (area: Area) => any;
}

function ClickHandler(props: ClickHandlerProps) {
  const map = useMapEvent("click", (e) => {
    if (!e.originalEvent.defaultPrevented) {
      // props.onAreaClick(null);
    }
  });
  return false;
}
