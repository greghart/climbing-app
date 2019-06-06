import * as Leaflet from 'leaflet';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';

type MyRouteConfig<SubProps = any> = Omit<RouteConfig, 'routes' | 'component'> & {
  component?: React.ComponentType<RouteConfigComponentProps<any> & SubProps> | React.ComponentType;
  // We can key a route for animation purposes
  key?: string;
  routes?: MyRouteConfig[];
  // Explorer components can setup a map component and a detail component
  mapComponent?: React.ComponentType<RouteConfigComponentProps<any> & { map: Leaflet.Map }>;
};

export default MyRouteConfig;
