import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Map } from 'react-leaflet';
import { renderRoutes } from 'react-router-config';
import find = require('lodash/find');
import lodashMap = require('lodash/map');

import BestTileLayer from '../BestTileLayer';
import AreasMap from './AreasMap';
import Crag from '../../../models/Crag';
import Area from '../../../models/Area';
import RouteContext from '../../context/RouteContext';
import { MyRouteConfig } from '../../getRoutes';

interface Props {
  crag: Crag;
  onAreaClick?: (area: Area) => any;
}

const CragMap: React.SFC<Props> = (props) => {
  const routeContext = React.useContext(RouteContext);
  const mapRef = React.createRef<Map>();

  return (
    // <AnimationContext.Consumer>
    //   {animation => (
    //     <SlideUp {...animation} appear>
          <Map
            className="map"
            key="map"
            ref={mapRef}
            center={props.crag.center}
            zoom={props.crag.defaultZoom}
            minZoom={17}
            maxZoom={props.crag.maxZoom}
            maxBounds={
              Leaflet.latLng(props.crag.center).toBounds(450)
            }
            zoomControl={false}
            onzoomend={(e) => {
            }}
            onclick={(e) => {
              if (!e.originalEvent.defaultPrevented) {
                props.onAreaClick(null);
              }
            }}
          >
            <BestTileLayer />
            {renderRoutes(
              lodashMap(
                routeContext.route.routes,
                (r: MyRouteConfig) => {
                  return {
                    ...r,
                    component: r.mapComponent || ((props) => <span />)
                  };
                }
              ),
              { mapRef, crag: props.crag },
            )}
            {/* <LayersControl position="topright">
              <LayersControl.Overlay name="Areas" checked={true}>
                <LayerGroup>
                  <AreasMap
                    areas={props.crag.areas}
                    onAreaClick={(area) => {
                      props.onAreaClick(area);
                    }}
                  />
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl> */}
          </Map>
    //     </SlideUp>
    //   )}
    // </AnimationContext.Consumer>
  );
};

export default CragMap;
