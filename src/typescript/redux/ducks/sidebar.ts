import { createAction, handleActions } from 'redux-actions';

/**
 * Duck for tracking and updating sidebar state.
 */
export type State = {
  open: boolean;
};
export type Payload = boolean;

// Actions
export const setOpen = createAction<Payload>('climbing-app/sidebar/SET_OPEN');

// Reducer
const initialState: State = { open: false };

const sidebar = handleActions<State, Payload>(
  {
    [setOpen.toString()]: (state, { payload }) => {
      console.log({ payload }, 'sidebar');
      if (typeof payload !== 'undefined') {
        return { open: payload };
      }
      return state;
    }
  },
  initialState
);

export default sidebar;
