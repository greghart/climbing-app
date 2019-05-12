import { MatchedRoute } from 'react-router-config';
import { Store } from 'redux';
import Bluebird from 'bluebird';
import isFunction from 'lodash/isFunction';

type Fetcher = (
  store: Store<any>,
  options: {
    params?: { [index: string]: unknown },
    query?: { [index: string]: unknown }
  }
) => Promise<unknown>;

type Fetchable = React.ComponentType & { fetch: Fetcher };
function isFetchable(component?: React.ComponentType | Fetchable): component is Fetchable {
  return !!component && isFunction((component as Fetchable).fetch);
}
/**
 * For a list of matched routes, fetch all data that follows our universal fetch API.
 *
 * Note this fetching is universally through Redux, so this is basically ran for its'
 * side effects against the store, and doesn't actually know what's happening within
 * the store at all.
 */
function fetchDataForMatches(
  matches: MatchedRoute<{}>[],
  store: Store<any>,
  query: { [index: string]: any }
) {
  matches.forEach((thisMatch) => {
    console.log({ thisMatch });
  });
  return Bluebird.map(matches, ({ route, match }) => {
    let result;
    if (isFetchable(route.component)) {
      result = Promise.resolve(
        route.component.fetch(
          store,
          {
            query,
            params: match.params,
          }
        )
      );
    } else {
      result = Promise.resolve();
    }
    return result
    .catch((_err: Error) => {
      // const err = UniversalErrorFactory.wrap(_err);
      // // Error codes handled in server render workflow
      // const handledCodes = [302];
      // if (handledCodes.indexOf(err.getStatusCode()) > - 1) {
      //   throw err;
      // }
      // // Ignore other errors while fetching data for now
      console.error(`fetchDataForRoute error -- ${_err.message} for route ${route.path}`);
    });
  });
}

export default fetchDataForMatches;
