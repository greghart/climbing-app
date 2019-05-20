import * as React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import RouteContext from '../context/RouteContext';
import { isFetchable } from '../../server/fetchDataForMatches';

interface Props {
  children: React.ReactNode;
}

const RouteConfigProvider: React.FunctionComponent<RouteConfigComponentProps & Props> = (props) => {
  return (
    <RouteContext.Provider value={{ route: props.route, location: props.location }}>
      {props.children}
    </RouteContext.Provider>
  );
};

function provideRoute<P>(WrappedComponent: React.ComponentType<RouteConfigComponentProps<P>>) {
  const RouteProvider: React.ComponentType<RouteConfigComponentProps<P>> = (props) => {
    return (
      <RouteConfigProvider {...props}>
        <WrappedComponent {...props} />
      </RouteConfigProvider>
    );
  };
  if (isFetchable(WrappedComponent)) {
    (RouteProvider as any).fetch = WrappedComponent.fetch;
  }
  return RouteProvider;
}

export default provideRoute;
