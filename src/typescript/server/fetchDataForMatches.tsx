import type { MatchedRoute } from "react-router-config";
import type { Action, Store } from "redux";
import * as ThunkTypes from "redux-thunk";
import Bluebird from "bluebird";
import { isFunction } from "lodash-es";

interface ThunkDispatch<S, E, A extends Action<any>, R> {
  (asyncAction: ThunkTypes.ThunkAction<R, S, E, A>): R;
}
type DispatchyStore = Omit<Store, "dispatch"> & {
  dispatch: ThunkDispatch<any, any, any, Promise<any>>;
};

type FetchContext<Params> = {
  store: DispatchyStore;
  params: Params;
  query: { [index: string]: unknown };
};
type Fetcher<Params> = (context: FetchContext<Params>) => Promise<unknown>;

type Fetchable<Params> = React.ComponentType<unknown> & {
  fetch: Fetcher<Params>;
};
function isFetchable(
  component?: React.ComponentType<any> | Fetchable<unknown>
): component is Fetchable<unknown> {
  return !!component && isFunction((component as Fetchable<unknown>).fetch);
}
/**
 * For a list of matched routes, fetch all data that follows our universal fetch API.
 *
 * Note this fetching is universally through Redux, so this is basically ran for its'
 * side effects against the store, and doesn't actually know what's happening within
 * the store at all.
 */
function fetchDataForMatches(
  matches: MatchedRoute<unknown>[],
  store: Store<any>,
  query: { [index: string]: any }
) {
  return Bluebird.map(matches, ({ route, match }) => {
    let result;
    if (isFetchable(route.component)) {
      result = Promise.resolve(
        route.component.fetch({
          query,
          store: store as any,
          params: match.params,
        })
      );
    } else {
      result = Promise.resolve();
    }
    return result.catch((_err: Error) => {
      // const err = UniversalErrorFactory.wrap(_err);
      // // Error codes handled in server render workflow
      // const handledCodes = [302];
      // if (handledCodes.indexOf(err.getStatusCode()) > - 1) {
      //   throw err;
      // }
      // // Ignore other errors while fetching data for now
      console.error(
        `fetchDataForRoute error -- ${_err.message} for route ${route.path}`
      );
    });
  });
}

export { isFetchable };
export type { Fetchable, FetchContext };
export default fetchDataForMatches;
