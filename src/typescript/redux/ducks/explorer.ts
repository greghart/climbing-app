import { createAction, handleActions } from 'redux-actions';

/**
 * Duck for tracking and updating the explorer tool state
 *
 * Leaflet tracks most DOM state internally, but we also have to track some.
 */
export type State = { selectedAreaId?: string };
export type Payload = string;

// Actions
export const selectArea = createAction<Payload>('climbing-app/explorer/SELECT_AREA');

// Reducer
const initialState: State = {};

const explorer = handleActions<State, Payload>(
  {
    [selectArea.toString()]: (state, { payload }) => {
      if (payload) {
        return { selectedAreaId: payload };
      }
      return state;
    }
  },
  initialState
);

export default explorer;
