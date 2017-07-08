import * as React from 'react';
import { SFC } from 'react';
import { Map } from 'react-leaflet';
import { connect } from 'react-redux';
import { RouteConfigComponentProps } from 'react-router-config';

import BestTileLayer from '../BestTileLayer';
import AreasMap from './AreasMap';
import { Area, Crag } from './types';

interface Props {
  crag: Crag
  selectedAreaId: string;
  onAreaClick: (area: Area) => any;
}

const CragMap: SFC<Props> = (props) => {
  return (
    <div>
      <h1>{props.crag.name}</h1>
      <Map
        className='map'
        center={props.crag.center}
        zoom={props.crag.zoom}
        minZoom={props.crag.minZoom}
        maxZoom={props.crag.maxZoom}
      >
        <BestTileLayer />
        <AreasMap
          areas={props.crag.areas}
          selectedAreaId={props.selectedAreaId}
          onAreaClick={props.onAreaClick}
        />
      </Map>
    </div>
  );
};

export default CragMap;
