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
  sidebarChildren: any;
}

/**
 * Main component for exploring a crag.
 * 
 * Sets up a basic sidebar layout.
 * - Sidebar (crag title + sidebarChildren)
 * - Main crag map
 *   - Search bar (TODO)
 *   - Action to open sidebar
 *   - Details view (TODO)
 */
const Crag: React.SFC<Props> = (props) => {
  console.warn(props, 'Crag');
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
          {props.crag.name}
          {props.sidebarChildren}
          {/* <AreasList
            {...props}
            areas={props.crag.areas}
          /> */}
        </div>
      }
    >
      <div className="h-100">
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

export { Props };
export default Crag;
