import * as React from 'react';
import Area from '../../../models/Area';
import ShowBreadcrumbs from '../show/ShowBreadcrumbs';

interface Props {
  area?: Area;
}

// Breadcrumbs will truncate and allow dropdown
const AreaBreadcrumbs: React.SFC<Props> = (props) => {
  return (
    <ShowBreadcrumbs
      title={props.area.name}
      links={[
        { content: props.area.crag.name, to: `/crags/${props.area.crag.id}` },
        { content: props.area.name },
      ]}
    />
  );
}

export default AreaBreadcrumbs;


