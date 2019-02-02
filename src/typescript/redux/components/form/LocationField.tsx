import * as React from 'react';
import * as Leaflet from 'leaflet';
import { WrappedFieldsProps, Field } from 'redux-form';
import Tracer from '../tracer/Tracer';
import MyPolygon from '../map/MyPolygon';

interface LocationProps {
  // The bounds we care about, to zoom map to
  bounds: Leaflet.LatLngBoundsExpression;
  // The positions of the area we care about, to draw a polygon
  positions?: Leaflet.LatLngExpression[];
}

const LocationField: React.ComponentType<WrappedFieldsProps & LocationProps> = (props) => {
  return (
    <div className="fixed-container fullscreen">
      <Tracer
        bounds={props.bounds}
      >
        {props.positions &&
          <MyPolygon positions={props.positions} />
        }
      </Tracer>
    </div>
  );
  return <span>test</span>;
};

export default LocationField;
