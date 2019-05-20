import * as React from 'react';
import { RouteConfigComponentProps, renderRoutes } from 'react-router-config';
import { LazyBoundary } from 'react-imported-component';

/**
 * The container route is a top level container to allow a single place to add global logic.
 *
 * Currently this just sets up a top level suspense.
 */
const ContainerRoute: React.SFC<RouteConfigComponentProps<{}>> = (props) => {
  return (
    <LazyBoundary fallback={<div>Loading...</div>}>
      {renderRoutes(props.route.routes, {})}
    </LazyBoundary>
  );
  // return renderRoutes(props.route.routes, {}, { key: props.location.key } as any);
};

export default ContainerRoute;
