import * as React from 'react';
import { SFC } from 'react';
import { Map } from 'react-leaflet';
import { connect } from 'react-redux';
import * as classNames from 'classnames';

import CragMap from './CragMap';
import AreasList from './AreasList';
import MapDetailLayout from '../layouts/MapDetailLayout';
import Area from '../../../models/Area';
import CragModel from '../../../models/Crag';

interface Props {
  crag: CragModel;
  selectedAreaId: string;
  onAreaClick: (area: Area) => any;
}

const Crag: SFC<Props> = (props) => {
  return (
    <MapDetailLayout
      title={`Crag ${props.crag.name}`}
      Map={
        <CragMap {...props} />
      }
      Detail={
        <div>
          Areas
          <AreasList
            {...props}
            areas={props.crag.areas}
          />
        </div>
      }
    />
  )
};

export default Crag;
