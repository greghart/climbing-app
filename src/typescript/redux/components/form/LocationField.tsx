import * as React from 'react';
import classNames = require('classnames');
import * as Leaflet from 'leaflet';
import { WrappedFieldsProps, Field } from 'redux-form';

interface LocationProps {
  // The bounds to default to for selecting a location
  bounds: Leaflet.LatLngBoundsExpression;
}

const LocationField: React.ComponentType<WrappedFieldsProps & LocationProps> = (props) => {
  return <span>test</span>;
};

export default LocationField;
