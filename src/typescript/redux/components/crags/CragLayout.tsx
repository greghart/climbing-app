import * as React from 'react';

import Crag from '../../../models/Crag';
import ShowLayout, { RouterProps } from '../show/ShowLayout';
import ShowBreadcrumbs from '../show/ShowBreadcrumbs';

type Props = RouterProps & {
  crag: Crag;
}

const CragLayout: React.SFC<Props> = (props) => {
  console.warn({ props }, 'CragLayout');
  return (
    <ShowLayout
      {...props}
      headerProps={{
        title: <ShowBreadcrumbs title={props.crag.name} links={[]} />,
        linkTo: `/explorer/${props.crag.id}`
      }}
      tabsProps={{
        routeBase: 'crags',
        entity: props.crag
      }}
      extraProps={{
        crag: props.crag
      }}
    />
  );
}
CragLayout.defaultProps = {
  crag: {
    name: 'Test Crag'
  } as any
};

export default CragLayout;
