import * as React from 'react';
import { SFC } from 'react';
import { Map } from 'react-leaflet';
import { connect } from 'react-redux';
import * as classNames from 'classnames';

import { Crag, Area } from './types';
import CragMap from './CragMap';
import AreasList from './AreasList';

interface Props {
  crag: Crag;
  selectedAreaId: string;
  onAreaClick: (area: Area) => any;
}

const Crag: SFC<Props> = (props) => {
  return (
    <div>
      <h2>Crag {props.crag.name}</h2>
      <div className='row'>
        <div className='col-md-10'>
          <CragMap
            {...props}
          />
        </div>
        <div className='col-md-2'>
          Areas
          <AreasList
            {...props}
            areas={props.crag.areas}
          />
        </div>
      </div>
    </div>
  )
};

export default Crag;
