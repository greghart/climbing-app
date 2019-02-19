import { compose, Dispatch } from 'redux';
import { connect, InferableComponentEnhancerWithProps } from 'react-redux';

import withMountAction from './withMountAction';

/**
 * Simple decorate that just composes `withMountAction` and `connect`
 *
 * Dispatch an action on mount (if you need to)
 */
function withMountDispatch<P>(
  action: (props: P) => any,
  shouldRun: (props: P) => boolean = () => true
) {
  return compose(
    connect(),
    withMountAction<P & { dispatch: Dispatch<any> }>(
      (props) => {
        if (shouldRun(props)) {
          return props.dispatch(
            action(props),
          );
        }
      },
    ),
  ) as InferableComponentEnhancerWithProps<{ dispatch: Dispatch<any> }, P>;
}

export default withMountDispatch;
