import { useMapEvent } from "react-leaflet/hooks";
import { usePathname, useRouter } from "next/navigation";
import { Crag } from "models";
import Map from "../map/Map";

interface Props {
  crag: Crag;
  children: React.ReactNode;
}

export default function CragMap(props: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const targetUrl = `/explorer/${props.crag.name}`;

  return (
    // <AnimationContext.Consumer>
    //   {animation => (
    //     <SlideUp {...animation} appear>
    <Map
      bounds={props.crag.bounds}
      center={props.crag.center}
      zoom={props.crag.defaultZoom}
      minZoom={props.crag.minZoom}
      maxZoom={props.crag.maxZoom}
    >
      <ClickHandler
        onClick={() => {
          if (pathName !== targetUrl) {
            router.back();
          }
          // router.push(`/explorer/${props.crag.name}`);
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
