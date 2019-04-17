import * as React from 'react';
import classNames from 'classnames';
import { renderRoutes } from 'react-router-config';
import omit from 'lodash/omit';

import PageLayout from '../layouts/PageLayout';
import ShowLayoutHeader from '../show/ShowLayoutHeader';
import ShowLayoutTabs from '../show/ShowLayoutTabs';
import { ExtractProps } from '../../../externals';
import RouteContext from '../../context/RouteContext';

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
  const test = renderRoutes(routeContext.route.routes, props.extraProps);
  console.warn({
    props,
    routeContext,
    test
  },           'ShowLayout');
  return (
    <PageLayout
      {...omit(props, 'headerProps', 'tabsProps', 'routerLocation')}
      header={
        <ShowLayoutHeader
          {...props.headerProps}
        />
      }
      content={
        <ShowLayoutTabs
          {...props.tabsProps}
        >
          <React.Fragment key={routeContext.location.pathname}>
            <React.Suspense fallback={<div>Loading...</div>}>
              {renderRoutes(routeContext.route.routes, props.extraProps)}
            </React.Suspense>
          </React.Fragment>
        </ShowLayoutTabs>
      }
      className={classNames({ 'p-0': true, 'bg-secondary': false, 'bg-white': true })}
    />
  );
};

export { RouterProps };
export default ShowLayout;
