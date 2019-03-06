import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { RouteConfigComponentProps } from 'react-router-config';

import SearchResults from './SearchResults';
import { State } from '../../reducer';
import { denormalize } from 'normalizr';
import { CragSchema } from '../../normalizr';
import withLoader from '../../decorators/withLoader';
import withMountAction from '../../decorators/withMountAction';
import exportCrag from '../../ducks/operations/exportCrag';
import { formValueSelector } from 'redux-form';

type OwnProps = RouteConfigComponentProps<{ crag: string }>;

/**
 * Container around search results.
 */
const formSelector = formValueSelector('search-form');
const mapStateToProps = (state: State, ownProps: OwnProps) => {
  console.warn({ ownProps }, 'SearchResultsContainer.mapStateToProps');
  return {
    search: state.search.search,
    crag: denormalize(
      ownProps.match.params.crag,
      CragSchema,
      state.entities,
    ),
    form: {
      entityType: formSelector(state, 'entityType'),
      filterShade: formSelector(state, 'filterShade'),
      shadeAtHour: formSelector(state, 'shadeAtHour'),
    }
  };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetchCrag: () => dispatch(
      exportCrag('singleton-fetch')([ownProps.match.params.crag]),
    ),
  };
};

type Props = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default compose(
  withRouter,
  connect<Props, DispatchProps, OwnProps>(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withMountAction<Props & DispatchProps>(
    (props) => {
      props.fetchCrag();
    },
  ),
  withLoader<Props>(
    (props) => !props.crag,
  ),
)(SearchResults);
