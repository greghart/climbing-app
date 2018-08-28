import { connect } from 'react-redux';

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

/**
 * Container around search results.
 */
const mapStateToProps = (state: State) => {
  return {
    search: state.search.search,
    crag: denormalize(
      'TramWay',// TODO Setup prop
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

export default connect<ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps>, any>(
  mapStateToProps,
  mapDispatchToProps
)(
  withMountAction(
    withLoader(
      SearchResults,
      (props) => !props.crag 
    ),
    (props) => {
      if (!props.crag) {
        props.fetchCrags();
      }
    }
  )
);

