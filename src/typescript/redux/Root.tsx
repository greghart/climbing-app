import * as React from 'react';
import { PropTypes, SFC } from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import {
  renderRoutes
} from 'react-router-config';

import getRoutes from './getRoutes';

type Props = {
  store: Store<any>;
};

const Root: SFC<Props> = ({ store }) => {
  let ComponentEl = (
    <Provider store={store}>
      <BrowserRouter>
        {renderRoutes(getRoutes())}
      </BrowserRouter>
    </Provider>
  );

  if (process.env.NODE_ENV !== 'production') {
    const DevTools = require('./DevTools').default;

    ComponentEl = (
      <Provider store={store}>
        <div>
          <BrowserRouter>
            {renderRoutes(getRoutes())}
          </BrowserRouter>
          {!window.devToolsExtension ? <DevTools /> : null}
        </div>
      </Provider>
    );
  }

  return ComponentEl;
};

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
