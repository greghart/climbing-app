import * as React from 'react';
import { Map } from 'react-leaflet';
import { connect } from 'react-redux';
import * as classNames from 'classnames';

import CragMap from './CragMap';
import AreasList from './AreasList';
import MapDetailLayout from '../layouts/MapDetailLayout';
import Area from '../../../models/Area';
import CragModel from '../../../models/Crag';
import SidebarContainer from '../layouts/SidebarContainer';

interface Props {
  crag: CragModel;
  selectedAreaId: string;
  onAreaClick: (area: Area) => any;
}

const Crag: React.SFC<Props> = (props) => {
  return (
    <SidebarContainer
      styles={{
        sidebar: {
          zIndex: '99999'
        }
      }}
      sidebar={
        <div className="h-100">
          Areas
          <AreasList
            {...props}
            areas={props.crag.areas}
          />
        </div>
      }
    >
      <CragMap {...props} />
    </SidebarContainer>
  );
  // return (
  //   <MapDetailLayout
  //     title={`Crag ${props.crag.name}`}
  //     Map={
  //       <CragMap {...props} />
  //     }
  //     Detail={
  //       <div>
  //         Areas
  //         <AreasList
  //           {...props}
  //           areas={props.crag.areas}
  //         />
  //       </div>
  //     }
  //   />
  // );
};

export default Crag;
