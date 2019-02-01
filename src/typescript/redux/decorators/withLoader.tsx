import * as React from "react";

function defaultIsLoading(props: { isLoading?: boolean }) {
  return props.isLoading === true;
}

/**
 * Defer the rendering of component until we've loaded data
 * @param - Is the component loading?
 * @param - Should we pass down a loading prop or no?
 **/
function withLoader<P> (isLoading: (props: P) => boolean = defaultIsLoading) {
  return (Component: React.ComponentType<P>) => {
    return (props: P) => {
      if (isLoading(props)) {
        return (
          <div className="container">
            <div className="row align-items-middle justify-content-center">
              <div className="col">
                Loading...
              </div>
            </div>
          </div>
        );
      }
      return <Component {...props} />;
    }
  };
}

export default withLoader;
