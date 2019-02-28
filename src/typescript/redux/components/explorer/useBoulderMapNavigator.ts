import * as React from 'react';
import { Map } from 'react-leaflet';

import Boulder from '../../../models/Boulder';

function useBoulderMapNavigator(
  mapRef: React.RefObject<Map>,
  boulder: Boulder
) {
  React.useEffect(
    () => {
      if (mapRef) {
        console.warn('useBoulderMapNavigator', boulder);
        if (boulder.polygon) {
          mapRef.current.leafletElement.fitBounds(
            boulder.polygon.coordinates.map((c) => {
              return [c.lat, c.lng] as [number, number];
            })
          );
        } else {
          mapRef.current.leafletElement.setView(
            [boulder.coordinate.lat, boulder.coordinate.lng],
            21
          );
        }
      }
    },
    [boulder.id]
  );
}

export default useBoulderMapNavigator;
