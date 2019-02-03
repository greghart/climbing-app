import * as React from 'react';
import { divIcon } from 'leaflet';
import { Marker } from 'react-leaflet';

const icon = divIcon({
  className: 'null',
  html: '<span><i class="fa fa-map-marked fa-lg text-light"/></span>'
})

const BoulderIcon = (props) => {
  return (
    <Marker
      {...props}
      icon={icon}
    />
  );
};

export default BoulderIcon;
