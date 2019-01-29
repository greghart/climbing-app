import * as React from 'react';
import fetchRoute from '../../ducks/operations/fetchRoute';
import Route from '../../../models/Route';
import ShowCommentsContainer from '../comments/ShowCommentsContainer';

// We just need the route id for connecting
interface OwnProps {
  myRoute: Route,
}

const RouteCommentsContainer: React.SFC<OwnProps> = (props) => {
  return (
    <ShowCommentsContainer
      action={() => fetchRoute('singleton-fetch')(props.myRoute.id.toString(), true)}
      entity={props.myRoute}
      newRoute={`/route/${props.myRoute.id}/comments/new`}
    />
  );
}

export default RouteCommentsContainer;
