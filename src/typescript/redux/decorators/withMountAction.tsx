import * as React from 'react';

function withMountAction<P>(action: (props: P) => any) {

  return (Component: React.ComponentType<P>): React.ComponentType<P> => {

    return class WithMount extends React.Component<P> {

      componentDidMount() {
        return action(this.props);
      }

      render() {
        return <Component {...this.props} />;
      }

    };
  };
}

export default withMountAction;
