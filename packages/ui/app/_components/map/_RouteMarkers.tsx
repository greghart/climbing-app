"use client";

import ConfirmedCircle from "@/app/_components/map/ConfirmedCircle";
import useSearchParamsPath from "@/app/_util/useSearchParamsPath";
import { Link } from "@mui/material";
import * as Leaflet from "leaflet";
import { reduce } from "lodash-es";
import { ICoordinateLiteral, IRoute } from "models";
import NextLink from "next/link";
import * as React from "react";
import { Popup } from "react-leaflet";

type Props = {
  routes: IRoute[];
};
// Need ID and coordinates to place on map
type PlaceableRoute = IRoute & { id: number; coordinates: ICoordinateLiteral };
function isPlaceable(r: IRoute): r is PlaceableRoute {
  return Boolean(r.coordinates && r.id);
}

const GROUP_ECHELON = 1;
/**
 * Group routes into circles of location
 *
 * We want to group routes into circles, so it's easier to handle overlapping routes
 * @todo Optimize algorithm? Route count should be low
 */
const groupRoutesByCoordinate = (routes: IRoute[]) => {
  const alreadyGrouped = {} as { [key: string]: boolean };
  const placeable = reduce(
    routes,
    (memo, r) => {
      if (isPlaceable(r)) {
        memo.push(r);
      }
      return memo;
    },
    [] as PlaceableRoute[]
  );
  return reduce(
    placeable,
    (memo, thisRoute) => {
      if (alreadyGrouped[thisRoute.id!]) {
        return memo;
      }
      alreadyGrouped[thisRoute.id!] = true;
      // Build out a circle centered around current group
      let currentCenter = thisRoute.coordinates;
      let currentEchelon = GROUP_ECHELON;

      const grouped = placeable.reduce((otherMemo, otherRoute, i) => {
        if (alreadyGrouped[otherRoute.id!]) {
          return otherMemo;
        }
        // Add next point to our circle, and find new center
        const distanceToNextPoint = Leaflet.latLng(currentCenter).distanceTo(
          Leaflet.latLng(otherRoute.coordinates)
        );
        if (distanceToNextPoint < currentEchelon) {
          alreadyGrouped[otherRoute.id] = true;
          otherMemo.push(otherRoute);
          // Build up the circle
          currentEchelon += distanceToNextPoint;
          const newCenter = {
            lat:
              currentCenter.lat +
              (otherRoute.coordinates.lat - currentCenter.lat) /
                (otherMemo.length + 1),
            lng:
              currentCenter.lng +
              (otherRoute.coordinates.lng - currentCenter.lng) /
                (otherMemo.length + 1),
          };
          currentCenter = newCenter;
        }
        return otherMemo;
      }, [] as PlaceableRoute[]);
      memo.push({
        coordinate: currentCenter,
        size: currentEchelon,
        routes: grouped.concat(thisRoute),
      });
      return memo;
    },
    [] as {
      coordinate: ICoordinateLiteral;
      size: number;
      routes: PlaceableRoute[];
    }[]
  );
};

/**
 * An interactive map diagram of a boulder
 *
 * Includes:
 *   * Boulder polygon, if any
 *   * Route markers with popup/links
 */
export default function RouteMarkers(props: Props) {
  const searchParamsPath = useSearchParamsPath();
  return (
    <React.Fragment>
      {groupRoutesByCoordinate(props.routes).map((thisGroup) => (
        <ConfirmedCircle
          center={[thisGroup.coordinate.lat, thisGroup.coordinate.lng]}
          // radius={thisGroup.size}
          radius={thisGroup.routes.length * 0.2}
          key={`${thisGroup.coordinate.lat}|${thisGroup.coordinate.lng}`}
        >
          <Popup closeButton={false}>
            {thisGroup.routes.map((r) => (
              <NextLink
                key={`route-${r.id}`}
                href={searchParamsPath(`routes/${r.id}`)}
                passHref
                legacyBehavior
              >
                <Link underline="hover" color="inherit">
                  {r.name} ({r.gradeRaw})
                </Link>
              </NextLink>
            ))}
          </Popup>
        </ConfirmedCircle>
      ))}
    </React.Fragment>
  );
}
