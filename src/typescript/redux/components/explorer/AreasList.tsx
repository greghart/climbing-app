import * as React from 'react';
import classNames from 'classnames';
import Area from '../../../models/Area';

import partial from 'lodash/partial';
import { Link } from 'react-router-dom';

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
          active: props.selected,
        },
      )}
    >
      <span onClick={props.onClick}>{props.area.name}</span>
      <Link to={`/areas/${props.area.id}`} className="ml-2">
        <i className="fa fa-external-link-alt" />
      </Link>
    </button>
  );
};

const AreaOpenListing: React.SFC<any> = (props) => {
  return (
    <div className="card">
      <div className="card-header">
        {props.area.name}
        <Link to={`/areas/${props.area.id}`} className="ml-2">
          <i className="fa fa-external-link-alt" />
        </Link>
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
                <Link to={`/boulders/${thisBoulder.id}`} className="ml-2">
                  <i className="fa fa-external-link-alt" />
                </Link>
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
              selected={props.selectedAreaId === thisArea.id.toString()}
            />
          );
        })}
      </ul>
    </div>
  );
};

export { Props as Props };
export default AreasList;
