import * as React from 'react';
import { renderRoutes } from 'react-router-config';

import Area from '../../../models/Area';
import CragModel from '../../../models/Crag';
import CragMap from './CragMap';
import SidebarContainer from '../layouts/SidebarContainer';
import SearchGroup from '../search/SearchGroup';
import SearchInputContainer from '../search/SearchInputContainer';
import RouteContext from '../../context/RouteContext';

interface Props {
  crag: CragModel;
  cragId: string;
  selectedAreaId: string;
  onAreaClick: (area: Area) => any;
  onCloseSidebar: () => unknown;
  onOpenSidebar: () => unknown;
  onOpenSearch: () => any;
  fetchCrag: (id: any) => unknown;
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
  const routeContext = React.useContext(RouteContext);
  return (
    <SidebarContainer
      styles={{
        sidebar: {
          zIndex: '10000',
        },
        content: {
          overflowY: 'none'
        },
        overlay: {
          zIndex: '10000'
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
        {/** Sub-routes are injected as a fixed container over the map */}
        {/** Position them rooted at the bottom of the screen */}
        <div className="fixed-container h-100">
          <div className="container h-100">
            <div className="row h-100 no-gutters align-items-end">
              <div className="col mb-3 over-map">
                {renderRoutes(routeContext.route.routes, { crag: props.crag })}
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
  );
};

export { Props };
export default Crag;
