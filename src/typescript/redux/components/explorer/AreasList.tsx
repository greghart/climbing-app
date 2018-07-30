import * as React from 'react';
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
};

const AreaListing: React.SFC<AreaListingProps> = (props) => {
  return (
    <a
      href="#"
      className={classNames(
        'list-group-item', 'list-group-item-action',
        {
          active: props.selected
        }
      )}
      onClick={props.onClick}
    >
      {props.area.name}
      {props.selected ?
        <ul>
          {props.area.boulders.map((thisBoulder) => {
            return (
              <li key={thisBoulder.id}>{thisBoulder.name}</li>
            );
          })}
        </ul>
        : <span />
      }
    </a>
  );
};

const AreasList: React.SFC<Props> = (props) => {
  return (
    <div>
      <ul className="list-group">
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
