import * as React from "react";
import { renderRoutes } from "react-router-config";

import _routes from "./routes.js";
import wrapAllRoutes from "../../routes/wrapAllRoutes.js";

const routes = wrapAllRoutes(_routes);

/**
 * A component to code split on
 */
const SplitRoute: React.FunctionComponent<{}> = (props) => {
  return renderRoutes(routes as any);
};

export default SplitRoute;
