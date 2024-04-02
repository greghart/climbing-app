import { createSelector } from "reselect";
import { denormalize, schema } from "normalizr";
import { isObject } from "lodash";

import asyncComponent from "../../decorators/asyncComponent.js";
import { type State, selectors } from "../../reducer.js";

/**
 * `buildWithChild` is a tool to help setup decorators for loading children
 *
 * Oftentimes we'll have a child relationship that needs to load data
 * separately, especially with polymorphic relationships (ie. photos comments).
 **/
function buildWithChild<Child, ChildOwner>(
  property: keyof ChildOwner,
  schema: schema.Entity
) {
  // type ChildOwner = { [K in S]?: Child; };

  return <OwnProps>(
    getChildOwner: (props: OwnProps) => ChildOwner,
    fetchChild: (owner: ChildOwner) => unknown
  ) => {
    const mapStateToProps = (state: State, ownProps: OwnProps) => {
      const owner = getChildOwner(ownProps);
      if (!owner[property]) {
        return { [property]: undefined };
      }
      if (isObject(owner[property])) {
        return { [property]: owner[property] };
      }
      const selectChildOwner = (state: State, ownProps: OwnProps) => {
        return getChildOwner(ownProps);
      };
      const selectChild = (entities, owner) =>
        denormalize(owner[property], schema, entities);
      const getChild = createSelector<State, OwnProps, any, ChildOwner, Child>(
        selectors.selectEntities,
        selectChildOwner,
        selectChild
      );
      return {
        [property]: getChild(state, ownProps),
      } as unknown as ChildOwner;
    };

    const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
      return {
        fetch: () => dispatch(fetchChild(getChildOwner(ownProps))),
      };
    };

    // Return decorator that takes a component that definitely wants `child`
    return asyncComponent<
      ReturnType<typeof mapStateToProps>,
      ReturnType<typeof mapDispatchToProps>,
      OwnProps
    >(mapStateToProps, mapDispatchToProps, (props: ChildOwner) => {
      return isObject(props[property]);
    });
  };
}

export default buildWithChild;
