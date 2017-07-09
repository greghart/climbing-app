import * as React from 'react';
import { SFC } from 'react';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';

// Import all containers here
import CragContainer from './containers/CragContainer';

const CragRoute: SFC<RouteConfigComponentProps<{ name: string }>> = (props) => {
  return (
    <CragContainer name={props.match.params.name} />
  );
};

/**
 * App encapsulates the full routes markup that our app consists of
 */
export default function getRoutes(): RouteConfig[] {
  return [
    {
      path: '/:name',
      component: CragRoute
    }
  ];
}
