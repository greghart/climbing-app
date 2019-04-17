/**
 * An interactive map diagram of a boulder
 *
 * Includes:
 *   * Boulder polygon, if any
 *   * Route markers with popup/links
 */
import * as React from 'react';
import { Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import * as Leaflet from 'leaflet';
import reduce from 'lodash/reduce';

import Route from '../../../models/Route';
import ConfirmedCircle from '../tracer/ConfirmedCircle';

type Props = {
  routes: Route[];
  formulateUrl?: (route: Route) => string;
};

const GROUP_ECHELON = 1;
/**
 * Group routes into circles of location
 *
 * We want to group routes into circles, so it's easier to handle overlapping routes
 * @todo Optimize algorithm? Route count should be low
 */
const groupRoutesByCoordinate = (routes: Route[]) => {
  const alreadyGrouped = {};
  const placeable = reduce(
    routes,
    (memo, r) => {
      if (r.coordinate) {
        memo.push(r);
      }
      return memo;
    },
    [],
  );
  return reduce(
    placeable,
    (memo, thisRoute) => {
      if (alreadyGrouped[thisRoute.id] || (!thisRoute.coordinate)) {
        return memo;
      }
      alreadyGrouped[thisRoute.id] = true;
      // Build out a circle centered around current group
      let currentCenter = thisRoute.coordinate;
      let currentEchelon = GROUP_ECHELON;

      const grouped = placeable.reduce(
        (otherMemo, otherRoute, i) => {
          if (alreadyGrouped[otherRoute.id]) {
            return otherMemo;
          }
          // Add next point to our circle, and find new center
          const distanceToNextPoint = Leaflet.latLng(currentCenter).distanceTo(
            Leaflet.latLng(otherRoute.coordinate),
          );
          if (distanceToNextPoint < currentEchelon) {
            alreadyGrouped[otherRoute.id] = true;
            otherMemo.push(otherRoute);
            // Build up the circle
            currentEchelon += distanceToNextPoint;
            const newCenter = {
              lat: (
                currentCenter.lat + (otherRoute.coordinate.lat - currentCenter.lat) /
                (otherMemo.length + 1)
              ),
              lng: (
                currentCenter.lng + (otherRoute.coordinate.lng - currentCenter.lng) /
                (otherMemo.length + 1)
              ),
            };
            currentCenter = newCenter;
          }
          return otherMemo;
        },
        [],
      );
      memo.push({
        coordinate: currentCenter,
        size: currentEchelon,
        routes: grouped.concat(thisRoute),
      });
      return memo;
    },
    [],
  );
};

const RouteMarkers: React.ComponentType<Props> = (props) => {
  return (
    <React.Fragment>
      {groupRoutesByCoordinate(props.routes).map((thisGroup) => (
        <ConfirmedCircle
          center={[thisGroup.coordinate.lat, thisGroup.coordinate.lng]}
          // radius={thisGroup.size}
          radius={thisGroup.routes.length * .2}
          key={`${thisGroup.coordinate.lat}|${thisGroup.coordinate.lng}`}
        >
          <Popup direction="center" closeButton={false}>
            {thisGroup.routes.map((r) => (
              <React.Fragment key={`route-${r.id}`}>
                <Link to={props.formulateUrl(r)} >
                  {r.name} ({r.gradeRaw})
                </Link>
                <br/>
              </React.Fragment>
            ))}
          </Popup>
        </ConfirmedCircle>

      ))}
    </React.Fragment>
  );
};

RouteMarkers.defaultProps = {
  formulateUrl: (route) => `/routes/${route.id}`
};

export default RouteMarkers;
