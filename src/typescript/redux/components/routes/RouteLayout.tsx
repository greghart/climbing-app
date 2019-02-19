import * as React from 'react';

import Route from '../../../models/Route';
import RouteBreadcrumbs from './RouteBreadcrumbs';
import ShowLayout, { RouterProps } from '../show/ShowLayout';

type Props = RouterProps & {
  route: Route;
}

const RouteLayout: React.SFC<Props> = (props) => {
  console.warn({ props });
  return (
    <ShowLayout
      {...props}
      headerProps={{
        title: <RouteBreadcrumbs route={props.route} />,
        linkTo: `/explorer/${props.route.boulder.area.crag.id}/${props.route.boulder.area.id}/${props.route.boulder.id}/${props.route.id}`
      }}
      tabsProps={{
        routeBase: 'routes',
        entity: props.route
      }}
      extraProps={{
        myRoute: props.route
      }}
    />
  );
}
RouteLayout.defaultProps = {
  route: {
    id: 1,
    name: 'Test Route',
    gradeRaw: 'v12',
    boulder: {
      name: 'EZ Boulder',
      area: {
        name: 'TramWay'
      }
    }
  } as any
};

export default RouteLayout;
