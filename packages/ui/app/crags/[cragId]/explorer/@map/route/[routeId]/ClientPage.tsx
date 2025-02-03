"use client";
import BoulderMap from "@/app/_components/map/BoulderMap";
import RouteMarkers from "@/app/_components/map/RouteMarkers";
import useBoulderView from "@/app/_components/map/useBoulderView";
import blockMapClicks from "@/app/_util/blockMapClicks";
import { IRoute, Route } from "models";

export default function ClientPage({ route: _route }: { route: IRoute }) {
  const route = new Route(_route);
  useBoulderView(route.boulder!);

  return (
    <BoulderMap boulder={route.boulder!} onClick={blockMapClicks}>
      <RouteMarkers routes={[route]} />
    </BoulderMap>
  );
}
