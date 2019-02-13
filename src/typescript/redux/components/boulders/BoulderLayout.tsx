import * as React from 'react';

import Boulder from '../../../models/Boulder';
import BoulderBreadcrumbs from './BoulderBreadcrumbs';
import ShowLayout, { RouterProps } from '../show/ShowLayout';

type Props = RouterProps & {
  boulder: Boulder;
}

const BoulderLayout: React.SFC<Props> = (props) => {
  console.warn({ props }, 'BoulderLayout');
  return (
    <ShowLayout
      {...props}
      headerProps={{
        title: <BoulderBreadcrumbs boulder={props.boulder} />,
        linkTo: `/explorer/${props.boulder.area.crag.id}/${props.boulder.area.id}/${props.boulder.id}`
      }}
      tabsProps={{
        routeBase: 'boulders',
        entity: props.boulder
      }}
      extraProps={{
        boulder: props.boulder
      }}
    />
  );
}
BoulderLayout.defaultProps = {
  boulder: {
    id: 1,
    name: 'Test Boulder',
    routes: [
      {
        id: 1,
        name: 'Test Route',
        gradeRaw: 'v12',
      }
    ],
    area: {
      name: 'Test Area',
      crag: {
        name: 'Test Crag'
      }
    }
  } as any
};

export default BoulderLayout;

