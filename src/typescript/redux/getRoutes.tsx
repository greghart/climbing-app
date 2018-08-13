import * as React from 'react';
import SFC = React.SFC;
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';
import CragContainer, { OwnProps } from './components/explorer/CragContainer';

// Import all containers here

const CragRoute: SFC<RouteConfigComponentProps<OwnProps>> = (props) => {
  console.log({
    props,
    params: props.match.params
  }, 'CragRoute');
  return (
    <CragContainer
      crag={props.match.params.crag}
      area={props.match.params.area}
    />
  );
};

/**
 * App encapsulates the full routes markup that our app consists of
 */
export default function getRoutes(): RouteConfig[] {
  return [
    {
      path: '/:crag/:area?',
      component: CragRoute,
    }
  ];
}
