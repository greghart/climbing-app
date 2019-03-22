import { compose } from 'redux';
import { connect, InferableComponentEnhancerWithProps } from 'react-redux';
import withMountAction from './withMountAction';
import withLoader from './withLoader';
import { State } from '../reducer';

/**
 * Shortcut to getting a normal composed decorator for an async component.
 * Helps cut down on includes and remembering how typing needs to work around compose.
 *
 * Includes:
 *   * Connecting to store
 *   * Fetching data that we need
 *   * Showing a loading indicator if we don't have it
 *
 * A significant concern is distinguishing have we tried to load data versus do
 * we just not have any data. The API *must* send data to allow the client to
 * make this distinction, or the client must track this state itself.
 * Currently, we rely on the server sending `null` to indicate lack of data as opposed
 * to not knowing whether we have data.
 */

export default function asyncComponent<StateProps, DispatchProps, OwnProps>(
  mapStateToProps: (state: State, ownProps: OwnProps) => StateProps,
  mapDispatchToProps: (dispatch, ownProps: OwnProps) => DispatchProps,
  hasDependants: (props: StateProps) => boolean,
  options: { fetchDispatch: string } = { fetchDispatch: 'fetch' },
) {
  return compose(
    connect<StateProps, DispatchProps, OwnProps>(
      mapStateToProps,
      mapDispatchToProps,
    ),
    withMountAction<StateProps & DispatchProps>(
      (props) => {
        if (!hasDependants(props)) {
          props[options.fetchDispatch]();
        }
      },
    ),
    withLoader<StateProps>(
      (props) => !hasDependants(props),
    ),
  ) as InferableComponentEnhancerWithProps<StateProps & DispatchProps, OwnProps>;
}
