import * as React from 'react';
import {
  Map,
} from 'react-leaflet';

import find = require('lodash/find');

import BestTileLayer from '../BestTileLayer';
import AreasMap from './AreasMap';
import Crag from '../../../models/Crag';
import Area from '../../../models/Area';
import SlideUp from '../animations/SlideUp';
import AnimationContext from '../animations/AnimationContext';

interface Props {
  crag: Crag;
  selectedAreaId?: string;
  onAreaClick?: (area: Area) => any;
}

const CragMap: React.SFC<Props> = (props) => {
  let map: Map;
  const selectedArea = find(
    props.crag.areas,
    (area) => area.name === props.selectedAreaId
  );
  return (
    <AnimationContext.Consumer>
      {animation => (
        <SlideUp {...animation} appear>
          <Map
            className="map"
            key="map"
            ref={(_map) => {
              map = _map;
            }}
            center={props.crag.center}
            zoom={props.crag.defaultZoom}
            minZoom={props.crag.minZoom}
            maxZoom={props.crag.maxZoom}
            zoomControl={false}
            bounds={selectedArea &&
              selectedArea.coordinates.map((c) => {
                return [c.lat, c.lng] as [number, number];
              })
            }
            onzoomend={(e) => {
              console.warn({
                e,
                zoom: map && map.leafletElement.getZoom()
              },           'onzoomend');
            }}
          >
            <BestTileLayer />
            <AreasMap
              areas={props.crag.areas}
              selectedAreaId={props.selectedAreaId}
              onAreaClick={(area) => {
                props.onAreaClick && props.onAreaClick(area);
              }}
            />
            {/* <LayersControl position="topright">
              <LayersControl.Overlay name="Areas" checked={true}>
                <LayerGroup>
                  <AreasMap
                    areas={props.crag.areas}
                    selectedAreaId={props.selectedAreaId}
                    onAreaClick={(area) => {
                      props.onAreaClick(area);
                    }}
                  />
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl> */}
          </Map>
        </SlideUp>
      )}
    </AnimationContext.Consumer>
  );
};

export default CragMap;
