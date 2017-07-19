import * as React from 'react';
import { SFC } from 'react';
import { Map } from 'react-leaflet';

import find = require('lodash/find');

import BestTileLayer from '../BestTileLayer';
import AreasMap from './AreasMap';
import transformCoordinates from './transformCoordinates';
import Crag from '../../../models/Crag';
import Area from '../../../models/Area';

interface Props {
  crag: Crag;
  selectedAreaId: string;
  onAreaClick: (area: Area) => any;
}

const CragMap: SFC<Props> = (props) => {
  let map: Map;
  const selectedArea = find(
    props.crag.areas,
    (area) => area.name === props.selectedAreaId
  );
  return (
    <Map
      className='map'
      ref={(_map) => {
        map = _map;
      }}
      center={props.crag.center}
      zoom={props.crag.defaultZoom}
      minZoom={props.crag.minZoom}
      maxZoom={props.crag.maxZoom}
      bounds={selectedArea &&
        selectedArea.coordinates.map((c) => c.tuple)
      }
    >
      <BestTileLayer />
      <AreasMap
        areas={props.crag.areas}
        selectedAreaId={props.selectedAreaId}
        onAreaClick={(area) => {
          props.onAreaClick(area);
        }}
      />
    </Map>
  );
};

export default CragMap;
