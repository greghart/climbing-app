import { createAction, handleActions } from 'redux-actions';

/**
 * Duck for tracking and updating the search tool state
 */
export type State = { search?: string };

// Actions
export const search = createAction<string>('climbing-app/search/SEARCH');

// Reducer
const initialState: State = {};

const searchReducer = handleActions<State, string>(
  {
    [search.toString()]: (state, { payload }) => {
      return { search: payload };
    },
  },
  initialState,
);

export default searchReducer;
