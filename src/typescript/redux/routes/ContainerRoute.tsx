import * as React from 'react';
import { RouteConfigComponentProps, renderRoutes } from 'react-router-config';

/**
 * The container route is a top level container to allow a single place to add global logic.
 *
 * Currently we don't have any such thing :shrug:
 */
const ContainerRoute: React.SFC<RouteConfigComponentProps<{}>> = (props) => {
  return renderRoutes(props.route.routes, {});
  // return renderRoutes(props.route.routes, {}, { key: props.location.key } as any);
};

export default ContainerRoute;
