import * as React from 'react';
import SFC = React.SFC;
import { RouteConfig, RouteConfigComponentProps, renderRoutes } from 'react-router-config';
import ReactCSSTransitionGroup = require('react-addons-css-transition-group');

import CragRoute from './routes/CragRoute';
import AreasListRoute from './routes/AreasListRoute';
import SearchRoute from './routes/SearchRoute';

const AnimationContainer: React.SFC<RouteConfigComponentProps<any>> = (props) => {
  return (
    <ReactCSSTransitionGroup 
      transitionName="slide-up"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={500}
    >
      <div key={props.location.key} >
        {renderRoutes(props.route.routes)}
      </div>
    </ReactCSSTransitionGroup>
  );
};

export default function getRoutes(): RouteConfig[] {
  return [
    {
      path: '*',
      component: AnimationContainer,
      routes: [
        {
          path: '/explorer/:crag/:area?',
          component: CragRoute,
          routes: [
            {
              path: '/explorer/:crag/:area',
              component: AreasListRoute
            }
          ],
        },
        {
          path: '/search',
          component: SearchRoute
        }
      ]
    }
  ];
}
