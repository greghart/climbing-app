import * as React from 'react';
import fetchRoute from '../../ducks/operations/fetchRoute';
import Boulder from '../../../models/Boulder';
import ShowCommentsContainer from '../comments/ShowCommentsContainer';

interface OwnProps {
  boulder: Boulder,
}

const RouteCommentsContainer: React.SFC<OwnProps> = (props) => {
  return (
    <ShowCommentsContainer
      action={() => fetchRoute('singleton-fetch')(props.boulder.id.toString(), true)}
      entity={props.boulder}
      newRoute={`/route/${props.boulder.id}/comments/new`}
    />
  );
}

export default RouteCommentsContainer;

