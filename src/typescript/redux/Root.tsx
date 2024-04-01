import * as React from "react";
import type { Store } from "redux";
import { Provider } from "react-redux";
import { renderRoutes } from "react-router-config";
import { ConnectedRouter } from "connected-react-router";
import type { History } from "history";

import getRoutes from "./getRoutes";

type Props = {
  store: Store<any>;
  history: History;
};

const Root: React.SFC<Props> = ({ store, history }) => {
  let ComponentEl = (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {renderRoutes(getRoutes())}
      </ConnectedRouter>
    </Provider>
  );

  if (process.env.NODE_ENV !== "production") {
    const DevTools = require("./DevTools").default;

    ComponentEl = (
      <Provider store={store}>
        <div style={{ height: "100%", width: "100%" }}>
          <div style={{ width: "100%", height: "auto" }}>
            <ConnectedRouter history={history}>
              {renderRoutes(getRoutes())}
            </ConnectedRouter>
          </div>
        </div>
      </Provider>
    );
  }

  return ComponentEl;
};

export default Root;
