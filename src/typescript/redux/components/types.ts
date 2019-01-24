import { Dispatch } from "redux";
import { ActionOrThunk } from "../../externals";

// Re-write some redux types to take advantage of redux-thunk
export type MapDispatchToPropsFunction<TDispatchProps, TOwnProps> =
    (dispatch: Dispatch<ActionOrThunk<any>>, ownProps: TOwnProps) => TDispatchProps;
export type OnSubmit<FormData, Props> = (data: FormData, dispatch: Dispatch<{}>, props: Props) => any;
