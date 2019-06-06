import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Map } from 'react-leaflet';
import { renderRoutes } from 'react-router-config';
import lodashMap from 'lodash/map';

import BestTileLayer from '../BestTileLayer';
import Crag from '../../../models/Crag';
import Area from '../../../models/Area';
import RouteContext from '../../context/RouteContext';
import MyRouteConfig from '../../routes/MyRouteConfig';

interface Props {
  crag: Crag;
  onAreaClick?: (area: Area) => any;
}

const CragMap: React.SFC<Props> = (props) => {
  const routeContext = React.useContext(RouteContext);
  const mapRef = React.createRef<Map>();

  const bounds = props.crag.bounds ?
    Leaflet.latLngBounds(
      Leaflet.latLng(props.crag.bounds.topLeft),
      Leaflet.latLng(props.crag.bounds.bottomRight)
    ) :
    Leaflet.latLng(props.crag.center).toBounds(400);
  console.warn(bounds);
  return (
    // <AnimationContext.Consumer>
    //   {animation => (
    //     <SlideUp {...animation} appear>
    <Map
      className="map"
      key="map"
      ref={mapRef}
      bounds={bounds}
      minZoom={18}
      maxZoom={props.crag.maxZoom}
      maxBounds={bounds}
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
        lodashMap<MyRouteConfig, MyRouteConfig>(
          routeContext.route.routes,
          (r: MyRouteConfig) => {
            return {
              ...r,
              component: r.mapComponent || ((props: any) => <span />)
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
