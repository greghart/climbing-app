import * as React from 'react';
import { SFC } from 'react';
import { Map } from 'react-leaflet';
import { connect } from 'react-redux';
import * as classNames from 'classnames';
import Area from '../../../models/Area';

import partial = require('lodash/partial');

type Props = {
  areas: Area[];
  onAreaClick: (area: Area) => any;
  selectedAreaId: string;
};

type AreaListingProps = {
  area: Area;
  selected: boolean;
  onClick: () => any;
}

const AreaListing: SFC<AreaListingProps> = (props) => {
  return (
    <li
      className={classNames({
        "text-success": props.selected
      })}
      onClick={props.onClick}
    >
      {props.area.name}
      {props.selected ?
        <ul>
          {props.area.boulders.map((thisBoulder) => {
            return (
              <li>{thisBoulder.name}</li>
            )
          })}
        </ul>
        : <span />
      }
    </li>
  );
}

const AreasList: SFC<Props> = (props) => {
  return (
    <div>
      <ul>
        {props.areas.map((thisArea) => {
          return (
            <AreaListing
              key={`area-${thisArea.name}`}
              onClick={partial(props.onAreaClick, thisArea)}
              area={thisArea}
              selected={props.selectedAreaId === thisArea.name}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default AreasList;
