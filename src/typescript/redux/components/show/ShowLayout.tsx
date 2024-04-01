import * as React from "react";
import classNames from "classnames";
import { renderRoutes } from "react-router-config";
import omit from "lodash/omit";
import { LazyBoundary } from "react-imported-component";

import PageLayout from "../layouts/PageLayout";
import ShowLayoutHeader from "../show/ShowLayoutHeader";
import ShowLayoutTabs from "../show/ShowLayoutTabs";
import type { ExtractProps } from "../../../externals";
import RouteContext from "../../context/RouteContext";

interface RouterProps {}

type Props = {
  headerProps: ExtractProps<typeof ShowLayoutHeader>;
  tabsProps: ExtractProps<typeof ShowLayoutTabs>;
  // Extra props to send to child routes
  extraProps?: any;
};

/**
 * All ShowLayouts are a typical PageLayout with:
 *  * a specific look
 *  * a header
 *  * tabs
 *  * content that is delegated to router
 */
const ShowLayout: React.SFC<Props> = (props) => {
  const routeContext = React.useContext(RouteContext);
  console.warn(
    {
      props,
      routeContext,
    },
    "ShowLayout"
  );
  return (
    <PageLayout
      {...omit(props, "headerProps", "tabsProps", "routerLocation")}
      header={<ShowLayoutHeader {...props.headerProps} />}
      content={
        <ShowLayoutTabs {...props.tabsProps}>
          <React.Fragment key={routeContext.location.pathname}>
            <LazyBoundary fallback={<div>Loading...</div>}>
              {renderRoutes(routeContext.route.routes, props.extraProps)}
            </LazyBoundary>
          </React.Fragment>
        </ShowLayoutTabs>
      }
      className={classNames({
        "p-0": true,
        "bg-secondary": false,
        "bg-white": true,
      })}
    />
  );
};

export type { RouterProps };
export default ShowLayout;
