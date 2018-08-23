import * as React from 'react';
import SFC = React.SFC;
import { RouteConfigComponentProps, renderRoutes } from "react-router-config";
import SlideUp from '../components/animations/SlideUp';
import { CSSTransitionGroup } from 'react-transition-group';
import { Switch, Route } from 'react-router';

interface ContainerParams {
}
/**
 * The container route is a top level container to allow a single place to add global logic.
 * 
 * Currently this is to handle animations -- at the top level, we don't auto animate, since
 * some components need to manage transition animation internally (such as map). Instead, we
 * just make sure to keep elements mounted until the child can finish unmounting.
 */
class ContainerRoute extends React.Component<RouteConfigComponentProps<ContainerParams>> {
 
  public render() {
    const props = this.props;
    console.warn({
      props,
      location: props.location.pathname
    }, 'ContainerRoute');
    return (
      <CSSTransitionGroup 
        transitionName="empty"
        transitionEnterTimeout={50000}
        transitionLeaveTimeout={50000}
        transitionAppearTimeout={50000}
        transitionAppear={false}
        component="div"
      >
        <Switch key={props.location.key} location={props.location}>
          {props.route.routes.map((route, i) => (
            <Route
              key={(route as any).key || i}
              path={route.path}
              exact={route.exact}
              strict={route.strict}
              render={(props: any) => {
                const Component: any = route.component;
                return (
                  <Component {...props} route={route} />
                );
              }}
            />
          ))}
        </Switch>
        {/* <React.Fragment key={props.location.key}>
          {(renderRoutes as any)(
            props.route.routes, 
            null, 
            { 
              key: props.location.key,
              location: props.location
            }
          )}
        </React.Fragment> */}
      </CSSTransitionGroup>
    );
  }

}

export default ContainerRoute;
