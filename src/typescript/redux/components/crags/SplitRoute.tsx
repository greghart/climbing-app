import * as React from 'react';
import { renderRoutes } from 'react-router-config';

import routes from './routes';

/**
 * A component to code split on
 */
const SplitRoute: React.FunctionComponent<{}> = (props) => {
  return renderRoutes(routes);
};

export default SplitRoute;
