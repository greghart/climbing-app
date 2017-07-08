import * as React from 'react';
import { Map } from 'react-leaflet';

import BestTileLayer from '../components/BestTileLayer';
import AreasMap from '../components/explorer/AreasMap';
const areas = require('../../../../static/data/TramData.json');

const Tram = () => {
  console.log({ areas });
  return (
    <div>
      <h1>Hello World 2</h1>
      <Map
        className='map'
        center={[33.810942, -116.645494]}
        zoom={18}
        minZoom={15}
        maxZoom={22}
      >
        <BestTileLayer />
        <AreasMap
          areas={areas}
        />
      </Map>
    </div>
  );
};

export default Tram;
