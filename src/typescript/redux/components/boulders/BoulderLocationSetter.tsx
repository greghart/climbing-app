import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Map } from 'react-leaflet';
import FixedContainerOverMap from '../layouts/FixedContainerOverMap';
import SearchGroup from '../search/SearchGroup';
import BestTileLayer from '../BestTileLayer';
import Coordinate from '../../../models/Coordinate';
import BoulderIcon from '../map/BoulderIcon';

interface Props {
  current?: Coordinate;
  bounds: Leaflet.LatLngBoundsExpression;
  onClick?(event: Leaflet.LeafletMouseEvent): unknown;
  onSubmit: (newCoordinate: Coordinate) => unknown;
  onCancel: React.MouseEventHandler;
}

const BoulderLocationSetter: React.ComponentType<Props> = (props) => {
  const input = (
    <div className="input-group-append flex-grow-up bg-light align-items-center text-center">
      <div className="col">
        Set the boulder's location
      </div>
      <div className="col-auto">
        {props.current &&
          <a role="button" className="btn btn-link" onClick={() => props.onSubmit(props.current)}>
            <i className="fa fa-check pull-right"/>
          </a>
        }
      </div>
    </div>
  );
  return (
    <div className="w-100 h-100">
      <FixedContainerOverMap>
        <SearchGroup
          onClickPrepend={props.onCancel}
          groupClass="flex-no-wrap"
          prepend={
            <a role="button" className="btn btn-link">
              <i className="fa fa-times-circle" />
            </a>
          }
          input={input}
        />
      </FixedContainerOverMap>
      <div
        className="row no-gutters"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Map
          style={{
            width: '100%',
            height: '100%',
          }}
          bounds={props.bounds}
          zoom={18}
          minZoom={15}
          maxZoom={22}
          zoomControl={false}
          onclick={props.onClick}
        >
          <BestTileLayer />
          {props.current &&
            <BoulderIcon
              position={props.current}
            />
          }
          {props.children}
        </Map>
      </div>
    </div>
  );
};

export default BoulderLocationSetter;
