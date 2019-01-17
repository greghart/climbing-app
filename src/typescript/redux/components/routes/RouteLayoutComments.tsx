import * as React from 'react';
import Route from '../../../models/Route';

interface Props {
  myRoute: Route;
}

const RouteLayoutComments: React.SFC<Props> = (props) => {
  return (
    <div>
      Comments will go here.
    </div>
  )
};

export default RouteLayoutComments;
