import { useMapEvent } from "react-leaflet/hooks";
import { usePathname, useRouter } from "next/navigation";
import { Crag } from "models";
import Map from "./Map";
import useRouteTo from "@/app/_components/useRouteTo";

interface Props {
  crag: Crag;
  children: React.ReactNode;
}

export default function CragMap(props: Props) {
  const routeTo = useRouteTo({ includeSearchParams: true });
  const pathName = usePathname();
  const targetUrl = `/explorer/${props.crag.id}`;

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
