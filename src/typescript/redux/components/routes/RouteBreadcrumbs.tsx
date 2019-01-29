import * as React from 'react';
import Route from '../../../models/Route';
import ShowBreadcrumbs from '../show/ShowBreadcrumbs';

interface Props {
  route?: Route;
}

// Breadcrumbs will truncate and allow dropdown
const RouteBreadcrumbs: React.SFC<Props> = (props) => {
  return (
    <ShowBreadcrumbs
      title={props.route.name}
      links={[
        { content: props.route.boulder.area.crag.name },
        { content: props.route.boulder.area.name },
        { content: props.route.boulder.name, to: `/boulders/${props.route.boulder.id}` },
        { content: props.route.name },
      ]}
    />
  );
}

export default RouteBreadcrumbs;
