import * as React from "react";

function withMountAction<P> (Component: React.ComponentType<P>, action: (props: P) => any) {

  return class WithMount extends React.Component<P> {

    componentDidMount() {
      return action(this.props);
    }

    render() {
      return <Component {...this.props} />;
    }

  }

}

export default withMountAction;
