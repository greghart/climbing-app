import useRouteTo from "@/app/_components/useRouteTo";
import { Crag } from "models";
import { usePathname } from "next/navigation";
import { useMapEvent } from "react-leaflet/hooks";
import Map from "./Map";

interface Props {
  crag: Crag;
  children: React.ReactNode;
}

export default function CragMap(props: Props) {
  const routeTo = useRouteTo({ includeSearchParams: true });
  const pathName = usePathname();
  // TODO: Refactor separate map components and explorer components
  // for easier re-use and composition
  // Eg. in PolygonField/PolygonTracer, we have to re-seed the crag info down, versus just
  // using something directly that is "A map bound to a crag"

  // Ignore clicks on the map if we're already on explorer page
  const targetUrls = [
    `/crags/${props.crag.id}/explorer`,
    `/crags/${props.crag.name}/explorer`,
  ];

  return (
    <Map
      bounds={props.crag.bounds}
      center={props.crag.center}
      zoom={props.crag.defaultZoom}
      minZoom={props.crag.minZoom}
      maxZoom={props.crag.maxZoom}
    >
      <ClickHandler
        onClick={() => {
          if (!targetUrls.includes(pathName)) {
            routeTo("../..");
          }
        }}
      />
      {props.children}
    </Map>
  );
}

interface ClickHandlerProps {
  onClick?: () => any;
}

function ClickHandler(props: ClickHandlerProps) {
  useMapEvent("click", (e) => {
    if (!e.originalEvent.defaultPrevented) {
      props.onClick && props.onClick();
    }
  });
  return false;
}
