import * as React from 'react';
import {
  Map,
  LayersControl,
  LayerGroup
} from 'react-leaflet';

import find = require('lodash/find');

import BestTileLayer from '../BestTileLayer';
import AreasMap from './AreasMap';
import Crag from '../../../models/Crag';
import Area from '../../../models/Area';

interface Props {
  crag: Crag;
  selectedAreaId: string;
  onAreaClick: (area: Area) => any;
}

const CragMap: React.SFC<Props> = (props) => {
  let map: Map;
  const selectedArea = find(
    props.crag.areas,
    (area) => area.name === props.selectedAreaId
  );
  return (
    <Map
      className="map"
      ref={(_map) => {
        map = _map;
      }}
      center={props.crag.center}
      zoom={props.crag.defaultZoom}
      minZoom={props.crag.minZoom}
      maxZoom={props.crag.maxZoom}
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
      <LayersControl position="topright">
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
      </LayersControl>
    </Map>
  );
};

export default CragMap;
