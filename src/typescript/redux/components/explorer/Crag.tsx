import * as React from 'react';

import CragMap from './CragMap';
import AreasList from './AreasList';
import Area from '../../../models/Area';
import CragModel from '../../../models/Crag';
import SidebarContainer from '../layouts/SidebarContainer';

interface Props {
  crag: CragModel;
  selectedAreaId: string;
  onAreaClick: (area: Area) => any;
  onOpenSidebar: () => any;
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
        <div
          className="h-100 bg-light"
        >
          Areas
          <AreasList
            {...props}
            areas={props.crag.areas}
          />
        </div>
      }
    >
      <div>
        <div
          className="btn btn-light over-map left-actions py-1 px-2"
          onClick={props.onOpenSidebar}
        >
          <i className="fa fa-bars " />
        </div>
        <CragMap {...props} />
      </div>
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
