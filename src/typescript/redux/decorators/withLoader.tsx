import * as React from "react";

function defaultIsLoading(props: { isLoading?: boolean }) {
  return props.isLoading === true;
}

/**
 * Defer the rendering of component until we've loaded data
 */
function withLoader<P> (Component: React.ComponentType<P>, isLoading: (props: P) => boolean = defaultIsLoading) {
  return (props: P) => {
    if (isLoading(props)) {
      return <span>Loading...</span>;
    }
    return <Component {...props} />;
  }
}

export default withLoader;