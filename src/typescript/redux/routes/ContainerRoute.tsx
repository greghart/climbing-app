import * as React from 'react';
import { RouteConfigComponentProps, renderRoutes } from 'react-router-config';

/**
 * The container route is a top level container to allow a single place to add global logic.
 *
 * Currently we don't have any such thing :shrug:
 */
const ContainerRoute: React.SFC<RouteConfigComponentProps<{}>> = (props) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {renderRoutes(props.route.routes, {})}
    </React.Suspense>
  );
  // return renderRoutes(props.route.routes, {}, { key: props.location.key } as any);
};

export default ContainerRoute;
