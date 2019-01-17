import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { RouteConfigComponentProps } from 'react-router-config';

import SearchResults from './SearchResults';
import { State } from '../../reducer';
import Area from '../../../models/Area';
import Boulder from '../../../models/Boulder';
import Route from '../../../models/Route';
import { denormalize } from 'normalizr';
import { CragSchema } from '../../normalizr';
import withLoader from '../../decorators/withLoader';
import withMountAction from '../../decorators/withMountAction';
import fetchCrags from '../../ducks/operations/fetchCrags';

type OwnProps = RouteConfigComponentProps<{ crag: string }>;

/**
 * Container around search results.
 */
const mapStateToProps = (state: State, ownProps: RouteConfigComponentProps<{ crag: string }>) => {
  console.warn({ ownProps }, 'SearchResultsContainer.mapStateToProps');
  return {
    search: state.search.search,
    crag: denormalize(
      ownProps.match.params.crag,
      CragSchema,
      state.entities
    )
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: (entity: Area | Boulder | Route) => {
      // TODO Implement
    },
    fetchCrags: () => dispatch(
      fetchCrags('singleton-fetch')()
    ),
  };
};

type Props = ReturnType<typeof mapStateToProps>;

export default compose(
  withRouter,
  connect<Props, ReturnType<typeof mapDispatchToProps>, OwnProps>(
    mapStateToProps,
    mapDispatchToProps
  ),
  withMountAction(
    (props) => {
      props.fetchCrags();
      // if (!props.crag) {
      //   props.fetchCrags();
      // }
    }
  ),
  withLoader<Props>(
    (props) => !props.crag
  )
)(SearchResults);
