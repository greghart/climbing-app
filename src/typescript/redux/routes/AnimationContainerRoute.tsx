import * as React from "react";
import type { RouteConfigComponentProps } from "react-router-config";
import { Switch, Route } from "react-router";
import { TransitionGroup } from "react-transition-group";
import Empty from "../components/animations/Empty";
import AnimationContext from "../components/animations/AnimationContext";

/**
 * AnimationContainerRoute allows sub-routes to hook into an animation context
 *
 * At the top level, we don't auto animate, since
 * some components need to manage transition animation internally (such as map). Instead, we
 * just make sure to keep elements mounted until the child can finish unmounting.
 * @todo This doesn't work right now :(
 */
const AnimationContainerRoute: React.SFC<RouteConfigComponentProps<any>> = (
  props
) => {
  return (
    // <TransitionGroup>
    //   <Empty key={props.location.key}>
    <Switch key={props.location.key} location={props.location}>
      {props.route.routes.map((route, i) => {
        return (
          <Route
            key={(route as any).key || i}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={(subProps: any) => {
              const Component: any = route.component;
              return (
                <AnimationContext.Provider
                  value={{
                    in:
                      // subProps.history.location === subProps.location
                      false,
                  }}
                  key={(route as any).key || i}
                >
                  <Component {...subProps} route={route} />
                </AnimationContext.Provider>
              );
            }}
          />
        );
      })}
    </Switch>
    //   </Empty>
    // </TransitionGroup>
  );
};

export default AnimationContainerRoute;
