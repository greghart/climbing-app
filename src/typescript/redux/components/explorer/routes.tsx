import * as React from "react";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import type { RouteConfigComponentProps } from "react-router-config";
import { Map } from "react-leaflet";

import Crag from "../../../models/Crag";
import Area from "../../../models/Area";
import Boulder from "../../../models/Boulder";
import CragExplorerRoute from "../../routes/CragExplorerRoute";
import AreasMap from "./AreasMap";
import { ConnectedAreaMap } from "./AreaMap";
import { ConnectedAreaOverlay } from "./AreaOverlay";
import { ConnectedBoulderOverlay } from "./BoulderOverlay";
import BoulderMap from "../boulders/BoulderMap";
import withBoulder from "../boulders/withBoulder";
import withArea from "../areas/withArea";
import useAreaMapNavigator from "./useAreaMapNavigator";
import useBoulderMapNavigator from "./useBoulderMapNavigator";
import type { LeafletMouseEvent } from "leaflet";
import { ConnectedRouteOverlay } from "./RouteOverlay";

/**
 * @todo When we render sub routes, we know we can pass optional props...
 *  - How do we signal this to the type system/do we need to?
 *  - How do we signal this to the developer if not?
 * For now, we just explicitly annotate this and need to track consistency with
 * parent component's usage of `renderRoutes`
 */
type SubProps = {
  crag: Crag;
  // For `mapComponent`s
  mapRef?: React.RefObject<Map>;
};

/**
 * We want to allow unhandled map clicks to "close" the currently selected entity.
 * Handling this turns out more complicated than expected, since we don't really
 * know if a click tapped through an existing polygon on its' way up.
 * Currently, our best method is to prevent handlers whenever a polygon is clicked.
 */
function blockClicks(e: LeafletMouseEvent) {
  e.originalEvent.preventDefault();
  e.originalEvent.stopPropagation();
  return false;
}

/**
 * Glue boulder map to explorer workflow
 *
 * We want to:
 *  * Adapt route params to boulder container
 *  * translate map to boulder center
 *  * Navigate to explorer route on route click
 */
type BoulderMapProps = RouteConfigComponentProps<{
  crag: string;
  area: string;
  boulder: string;
}> &
  SubProps;
const WithBoulderMap = withBoulder(BoulderMap);
const BoulderMapRoute: React.ComponentType<BoulderMapProps> = (props) => {
  const root = `/explorer/${[
    props.match.params.crag,
    props.match.params.area,
    props.match.params.boulder,
  ].join("/")}`;
  return (
    <WithBoulderMap
      {...props}
      boulderId={props.match.params.boulder}
      formulateUrl={(r) => `${root}/${r.id}`}
    />
  );
};
const BoulderNavigator = withBoulder(
  (props: { boulder: Boulder } & SubProps) => {
    // TODO Integrate react-redux hooks so we can make this super sleek
    useBoulderMapNavigator(props.mapRef, props.boulder);
    return <React.Fragment />;
  }
);

/**
 * Glue area map to explorer workflow
 *
 * We want to:
 *  * Adapt route params to area container
 *  * stop clicks from propagating (to avoid closure of area),
 *  * Translate map to area center
 *  * Navigate to boulder explorer on boulder click
 */
type AreaMapProps = RouteConfigComponentProps<{ area: string }> & SubProps;
const areaMapMapDispatchToProps = (dispatch, ownProps: AreaMapProps) => {
  const root = `/explorer/${ownProps.crag.id}/${ownProps.match.params.area}`;
  return {
    onBoulderClick: (b: Boulder) => {
      return dispatch(push(`${root}/${b.id}`));
    },
  };
};
const AreaNavigator = withArea((props: { area: Area } & SubProps) => {
  // TODO Integrate react-redux hooks so we can make this super sleek
  useAreaMapNavigator(props.mapRef, props.area);
  return <React.Fragment />;
});
const ClickableAreaMap = connect(
  undefined,
  areaMapMapDispatchToProps
)(ConnectedAreaMap);
const AreaMapRoute: React.ComponentType<AreaMapProps> = (props) => {
  return (
    <ClickableAreaMap
      key={props.match.params.area}
      areaId={props.match.params.area}
      polygon={true}
      boulders={true}
      tooltip={false}
      onClick={blockClicks}
      {...props}
    />
  );
};

/**
 * Glue base crag map to explorer workflow.
 *
 * We want to:
 *   * Show area tooltips and have them click into area explorer routes
 */
type CragMapProps = RouteConfigComponentProps<{ crag: string }> & SubProps;
const cragMapMapDispatchToProps = (dispatch, ownProps: CragMapProps) => {
  const root = `/explorer/${ownProps.crag.id}`;
  return {
    onAreaClick: (a: Area, e) => {
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
      return dispatch(push(`${root}/${a.id}`));
    },
  };
};
const ClickableAreasMap = connect(
  undefined,
  cragMapMapDispatchToProps
)(AreasMap);

/**
 * Routes for the explorer
 * Explorer -- map view of a crag
 * Sub routes are map overlays
 * Sidebar is available that will be settings, UX TBD
 */
const routes = [
  {
    path: "/explorer/:crag/:area?",
    component: CragExplorerRoute,
    key: "explorer",
    routes: [
      {
        path: "/explorer/:crag/:area/:boulder/:route",
        component: (props) => (
          <ConnectedRouteOverlay
            key={props.match.params.route}
            {...props}
            routeId={props.match.params.route}
          />
        ),
        mapComponent: (props) => (
          <React.Fragment>
            {/** Show the area polygon */}
            {/* <AreaMapRoute
              {...props}
              mapFitBounds={false}
            /> */}
            {/** Show the boulder map */}
            <BoulderMapRoute
              {...props}
              showRoutes={true}
              boulderId={props.match.params.boulder}
              onClick={blockClicks}
            />
            {/** Navigate to boulder */}
            <BoulderNavigator
              {...props}
              boulderId={props.match.params.boulder}
            />
          </React.Fragment>
        ),
      },
      {
        path: "/explorer/:crag/:area/:boulder",
        component: (props) => (
          <ConnectedBoulderOverlay
            key={props.match.params.boulder}
            {...props}
            boulderId={props.match.params.boulder}
          />
        ),
        mapComponent: (props) => (
          <React.Fragment>
            {/** Show the area polygon */}
            {/* <AreaMapRoute
              {...props}
              mapFitBounds={false}
            /> */}
            <BoulderMapRoute
              {...props}
              boulderId={props.match.params.boulder}
              onClick={blockClicks}
            />
            <BoulderNavigator
              {...props}
              boulderId={props.match.params.boulder}
            />
          </React.Fragment>
        ),
      },
      {
        path: "/explorer/:crag/:area",
        component: (props) => (
          <ConnectedAreaOverlay
            key={props.match.params.area}
            {...props}
            areaId={props.match.params.area}
          />
        ),
        mapComponent: (props) => (
          <React.Fragment>
            <AreaMapRoute {...props} />
            <AreaNavigator {...props} areaId={props.match.params.area} />
          </React.Fragment>
        ),
        key: "explorer_area",
      },
      {
        path: "/explorer/:crag",
        component: () => <span />,
        mapComponent: (props) => (
          <ClickableAreasMap {...props} areas={props.crag.areas} />
        ),
      },
    ],
  },
];

export default routes;
