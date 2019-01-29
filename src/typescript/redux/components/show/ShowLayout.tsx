import * as React from 'react';
import * as classNames from 'classnames';
import { renderRoutes, RouteConfig } from 'react-router-config';
import { Location } from 'history';
import { Omit } from 'utility-types';
import omit = require('lodash/omit');

import PageLayout from '../layouts/PageLayout';
import ShowLayoutHeader, { Props as HeaderProps } from '../show/ShowLayoutHeader';
import ShowLayoutTabs, { Props as TabsProps} from '../show/ShowLayoutTabs';

// Separate router props so we can have smarter consumers
interface RouterProps {
  routerConfig: RouteConfig;
  routerLocation: Location;
};

type Props = RouterProps & {
  headerProps: HeaderProps;
  tabsProps: Omit<TabsProps, 'routerLocation'>;
  // Extra props to send to child routes
  extraProps?: any;
}

/**
 * All ShowLayouts are a typical PageLayout with:
 *  * a specific look
 *  * a header
 *  * tabs
 *  * content that is delegated to router
 */
const ShowLayout: React.SFC<Props> = (props) => {
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
          routerLocation={props.routerLocation}
          {...props.tabsProps}
        >
          {renderRoutes(props.routerConfig.routes, props.extraProps)}
        </ShowLayoutTabs>
      }
      className={classNames({ 'p-0': true, 'bg-secondary': false, 'bg-white': true })}
    />
  );
}

export { RouterProps };
export default ShowLayout;
