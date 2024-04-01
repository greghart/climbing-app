import type { Dispatch } from "redux";
import type { ThunkDispatch } from "redux-thunk";

// Re-write some redux types to take advantage of redux-thunk
export type MapDispatchToPropsFunction<TDispatchProps, TOwnProps> = (
  dispatch: ThunkDispatch<any, any, any>,
  ownProps: TOwnProps
) => TDispatchProps;
export type OnSubmit<FormData, Props> = (
  data: FormData,
  dispatch: Dispatch<any>,
  props: Props
) => any;
