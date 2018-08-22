import * as React from 'react';

import CragMap from './CragMap';
import AreasList from './AreasList';
import Area from '../../../models/Area';
import CragModel from '../../../models/Crag';
import SidebarContainer from '../layouts/SidebarContainer';
import SearchInput from '../search/SearchInput';
import SearchGroup from '../search/SearchGroup';

interface Props {
  crag: CragModel;
  selectedAreaId: string;
  onAreaClick: (area: Area) => any;
  onOpenSidebar: () => any;
  onOpenSearch: () => any;
  sidebarChildren: React.ReactNode;
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
    <div>
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
            className="over-map fixed-container row no-gutters"
          >
            <div className="col">
              <SearchGroup
                onClickPrepend={props.onOpenSidebar}
                prepend={
                  <i className="fa fa-bars" />
                }
                input={
                  <SearchInput 
                    onClick={props.onOpenSearch}
                  />
                }
              />
            </div>
          </div>
          <CragMap {...props} />
        </div>
      </SidebarContainer>
    </div>
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
