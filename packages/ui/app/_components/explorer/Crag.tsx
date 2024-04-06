import _Sidebar from "react-sidebar";
const Sidebar = (_Sidebar as any)(React.Component);
import SearchGroup from "@/app/_components/search/SearchGroup";
import SearchInput from "@/app/_components/search/SearchInput";
import React from "react";

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
interface Props {
  // crag: CragModel;
  cragId: string;
  // onAreaClick: (area: Area) => any;
  onCloseSidebar: () => unknown;
  onOpenSidebar: () => unknown;
  onOpenSearch: () => any;
  fetchCrag: (id: any) => unknown;
  sidebarChildren: React.ReactNode;
  children: React.ReactNode;
}

export default function Crag(props: Partial<Props>) {
  return (
    <Sidebar
      styles={{
        sidebar: {
          zIndex: "10000",
        },
        content: {
          overflowY: "none",
        },
        overlay: {
          zIndex: "10000",
        },
      }}
      sidebar={
        <div className="h-100 bg-light">
          <SearchGroup
            onClickPrepend={props.onCloseSidebar}
            prepend={<i className="fa fa-bars" />}
            input={
              <div className="input-group-append flex-grow-up align-items-center text-center">
                {/* {props.crag.name} */}
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
                  prepend={<i className="fa fa-bars" />}
                  input={<SearchInput onClick={props.onOpenSearch} />}
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
              <div className="col mb-3 over-map">{props.children}</div>
            </div>
          </div>
        </div>
        <div className="container px-0">
          <div className="row no-gutters">
            <div className="col">{/* <CragMap {...props} /> */}</div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
