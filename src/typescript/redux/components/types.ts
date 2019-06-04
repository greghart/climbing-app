import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionOrThunk } from '../../externals';

// Re-write some redux types to take advantage of redux-thunk
export type MapDispatchToPropsFunction<TDispatchProps, TOwnProps> =
    (dispatch: ThunkDispatch<any, any, any>, ownProps: TOwnProps) => TDispatchProps;
export type OnSubmit<FormData, Props> = (
  data: FormData,
  dispatch: Dispatch<any>,
  props: Props
) => any;
