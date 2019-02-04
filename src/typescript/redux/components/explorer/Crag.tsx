import * as React from 'react';

import CragMap from './CragMap';
import Area from '../../../models/Area';
import CragModel from '../../../models/Crag';
import SidebarContainer from '../layouts/SidebarContainer';
import SearchGroup from '../search/SearchGroup';
import SearchInputContainer from '../search/SearchInputContainer';

interface Props {
  crag: CragModel;
  cragId: string;
  selectedAreaId: string;
  onAreaClick: (area: Area) => any;
  onCloseSidebar: () => unknown;
  onOpenSidebar: () => unknown;
  onOpenSearch: () => any;
  fetchCrags: () => any;
  sidebarChildren: React.ReactNode;
}

/**
 * Main component for exploring a crag.
 *
 * Sets up a basic sidebar layout.
 * - Sidebar (crag title + sidebarChildren)
 * - Main crag map
 *   - Search bar
 *   - Action to open sidebar
 *   - Details view
 */
const Crag: React.SFC<Props> = (props) => {
  console.warn(props, 'Crag');
  return (
    <div className="container">
    <SidebarContainer
      styles={{
        sidebar: {
          zIndex: '1000'
        },
        content: {
          overflowY: 'none'
        }
      }}
      sidebar={
        <div className="h-100 bg-light">
          <SearchGroup
            onClickPrepend={props.onCloseSidebar}
            prepend={
              <i className="fa fa-bars" />
            }
            input={
              <div className="input-group-append flex-grow-up align-items-center text-center">
                {props.crag.name}
              </div>
            }
          />
          {props.sidebarChildren}
        </div>
      }
    >
      <div className="h-100">
        <div className="fixed-container over-map">
          <div className="container">
            <div className="row no-gutters pt-3">
              <div className="col">
                <SearchGroup
                  onClickPrepend={props.onOpenSidebar}
                  prepend={
                    <i className="fa fa-bars" />
                  }
                  input={
                    <SearchInputContainer
                      onClick={props.onOpenSearch}
                    />
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container px-0">
          <div className="row no-gutters">
            <div className="col">
              <CragMap {...props} />
            </div>
          </div>
        </div>
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
