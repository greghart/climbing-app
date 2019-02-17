/**
 * An inline map inside a page
 *
 * Ensures proper sizing, nicer inset UI, and no zoom
 */
import * as React from 'react';
import { Map } from 'react-leaflet';
import BaseMap from './BaseMap';
import { ExtractProps } from '../../../externals';
import classNames = require('classnames');

type Props = ExtractProps<typeof BaseMap>;

const InlineMap = React.forwardRef<Map, Props>((props, ref) => {
  return (
    <BaseMap
      {...props}
      ref={ref}
      className={classNames(props.className, 'rounded')}
      style={{ paddingBottom: '50%' }}
      scrollWheelZoom={false}
      dragging={false}
    />
  );
});

export default InlineMap;
