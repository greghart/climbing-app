import { createAction, handleActions } from 'redux-actions';

/**
 * Duck for tracking and updating accordion state.
 *
 * The duck sets no default state -- instead, consumers can choose a default,
 * and the container will set the right state on first open/close.
 */
export type State = { open: boolean };

// Actions
export type Payload = boolean;
export const setOpen = createAction<Payload>('climbing-app/accordion/SET_OPEN');

// Reducer
const initialState: State = { open: undefined };

const accordion = handleActions<State, Payload>(
  {
    [setOpen.toString()]: (state, { payload }) => {
      if (typeof payload !== 'undefined') {
        return { open: payload };
      }
      return state;
    },
  },
  initialState,
);

export default accordion;
