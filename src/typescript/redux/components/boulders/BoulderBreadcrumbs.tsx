import * as React from "react";
import Boulder from "../../../models/Boulder.js";
import ShowBreadcrumbs from "../show/ShowBreadcrumbs.js";

interface Props {
  boulder?: Boulder;
}

// Breadcrumbs will truncate and allow dropdown
const BoulderBreadcrumbs: React.SFC<Props> = (props) => {
  return (
    <ShowBreadcrumbs
      title={props.boulder.name}
      links={[
        {
          content: `${props.boulder.area.crag.name}`,
          to: `/crags/${props.boulder.area.crag.id}`,
        },
        {
          content: props.boulder.area.name,
          to: `/areas/${props.boulder.area.id}`,
        },
        { content: props.boulder.name },
      ]}
    />
  );
};

export default BoulderBreadcrumbs;
