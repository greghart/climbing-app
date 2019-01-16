import * as React from 'react';
import Route from '../../../models/Route';

interface Props {
  route?: Route;
}

const RouteBreadcrumbs: React.SFC<Props> = (props) => {
  return (
    <div>
      {props.route.boulder.area.name} / {props.route.boulder.name} / {props.route.name}
    </div>
  )
}

export default RouteBreadcrumbs;
