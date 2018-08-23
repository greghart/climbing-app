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
  if (props.selected) {
    return <AreaOpenListing {...props} />;
  }
  return (
    <button
      role="button"
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
        <ul className="list-group">
          {props.area.boulders.map((thisBoulder) => {
            return (
              <button
                role="button"
                key={thisBoulder.id}
                className="list-group-item, list-group-item-action"
                onClick={props.onClick}
              >
                {thisBoulder.name}
              </button>
            );
          })}
        </ul>
        : <span />
      }
    </button>
  );
};

const AreaOpenListing: React.SFC<any> = (props) => {
  return (
    <div className="card">
      <div className="card-header">
        {props.area.name}
      </div>
      <div className="card-body">
        <ul className="list-group">
          {props.area.boulders.map((thisBoulder) => {
            return (
              <button
                role="button"
                key={thisBoulder.id}
                className="list-group-item list-group-item-action"
              >
                {thisBoulder.name}
              </button>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const AreasList: React.SFC<Props> = (props) => {
  console.warn(props, 'AreasList');
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

export { Props as Props };
export default AreasList;
