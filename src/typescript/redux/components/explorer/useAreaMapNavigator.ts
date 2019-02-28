import * as React from 'react';
import { Map } from 'react-leaflet';

import Area from '../../../models/Area';

function useAreaMapNavigator(mapRef: React.RefObject<Map>, area: Area) {
  React.useEffect(
    () => {
      if (mapRef) {
        mapRef.current.leafletElement.fitBounds(
          area.polygon.coordinates.map((c) => {
            return [c.lat, c.lng] as [number, number];
          })
        );
      }
    },
    [area.id]
  );
}

export default useAreaMapNavigator;
