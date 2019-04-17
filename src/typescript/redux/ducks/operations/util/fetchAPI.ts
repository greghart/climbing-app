// import { normalize, Schema } from 'normalizr';

// import {
//   requestEntities,
//   receiveEntities,
//   failedEntities
// } from '../../entities';
// import scopeThunker from './scopeThunker';
// import getAPIOperation from './getAPIOperation';
// import getScopedParamsFromState, { baseParamGetter } from './getScopedParamsFromState';
// import defaults from 'lodash/defaults';

// // Type imports
// import * as ReduxActions from 'redux-actions';

// import _debug from 'debug';
// const debug = _debug('apollo-demand-app:client:actions:util:fetchAPI');

// interface ActionOptions {
//   start: ReduxActions.ActionFunctionAny<ReduxActions.Action<any>>;
//   end: ReduxActions.ActionFunctionAny<ReduxActions.Action<any>>;
//   error: ReduxActions.ActionFunctionAny<ReduxActions.Action<any>>;
// }

// /**
//  * Fetch from app API action creator
//  *
//  * @param {string} - The path to the swagger API operation. `tag.operation`
//  * @param {object} - The normalizr schema of the response
//  * @param {object} - Redux actions to trigger at key events
//  * @param {function} - (optional) base parameter getter method - gets parameters from state.
//  * @returns scopeable thunker
//  */
// export default (
//   apiOperation: string,
//   responseSchema?: Schema,
//   actions: ActionOptions = {
//     start: requestEntities,
//     end: receiveEntities,
//     error: failedEntities
//   },
//   getBaseParams?: baseParamGetter
// ) => {
//   return scopeThunker((options, scope) => {
//     return (dispatch, getState, dispatchParams) => {
//       let resolvedOptions = options;
//       if (!!getBaseParams) {
//         resolvedOptions = defaults(
//           {},
//           getScopedParamsFromState(
//             getState(),
//             scope,
//             getBaseParams
//           ),
//           options
//         );
//       }
//       // Track request state
//       dispatch(actions.start(resolvedOptions));

//       // Isomorphic API actions given to us by middleware
//       const { api } = dispatchParams;
//       return Promise.resolve(
//         getAPIOperation(
//           api,
//           apiOperation
//         )(options, getClientAuths(getCurrentOrgId()))
//       )
//       .catch(handleAPIError(dispatch, dispatchParams))
//       .catch((err: Error) => {
//         dispatch(actions.error(err));
//         throw err;
//       })
//       .then((results: any) => {
//         const endResponse = responseSchema ?
//           normalize(
//             results,
//             responseSchema
//           )
//           :
//           results
//         ;
//         return dispatch(
//           actions.end(endResponse)
//         );
//       });

//     };
//   });
// };
