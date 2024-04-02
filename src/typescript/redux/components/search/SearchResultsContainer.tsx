import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import type { RouteConfigComponentProps } from "react-router-config";

import SearchResults from "./SearchResults.js";
import type { State } from "../../reducer.js";
import { denormalize } from "normalizr";
import { CragSchema } from "../../normalizr.js";
import withLoader from "../../decorators/withLoader.js";
import withMountAction from "../../decorators/withMountAction.js";
import exportCrag from "../../ducks/operations/exportCrag.js";
import { formValueSelector } from "redux-form";

type OwnProps = RouteConfigComponentProps<{ crag: string }>;

/**
 * Container around search results.
 */
const formSelector = formValueSelector("search-form");
const mapStateToProps = (state: State, ownProps: OwnProps) => {
  console.warn({ ownProps }, "SearchResultsContainer.mapStateToProps");
  return {
    search: state.search.search,
    crag: denormalize(ownProps.match.params.crag, CragSchema, state.entities),
    form: {
      entityType: formSelector(state, "entityType"),
      filterShade: formSelector(state, "filterShade"),
      shadeAtHour: formSelector(state, "shadeAtHour"),
    },
  };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetchCrag: () =>
      dispatch(exportCrag("singleton-fetch")([ownProps.match.params.crag])),
  };
};

type Props = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default compose(
  withRouter,
  connect<Props, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps),
  withMountAction<Props & DispatchProps>((props) => {
    props.fetchCrag();
  }),
  withLoader<Props>((props) => !props.crag)
)(SearchResults);
