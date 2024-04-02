import * as React from "react";
import Route from "../../../models/Route.js";
import ShowBreadcrumbs from "../show/ShowBreadcrumbs.js";

interface Props {
  route?: Route;
}

// Breadcrumbs will truncate and allow dropdown
const RouteBreadcrumbs: React.SFC<Props> = (props) => {
  return (
    <ShowBreadcrumbs
      title={props.route.name}
      links={[
        {
          content: props.route.boulder.area.crag.name,
          to: `/crags/${props.route.boulder.area.crag.id}`,
        },
        {
          content: props.route.boulder.area.name,
          to: `/areas/${props.route.boulder.area.id}`,
        },
        {
          content: props.route.boulder.name,
          to: `/boulders/${props.route.boulder.id}`,
        },
        { content: props.route.name },
      ]}
    />
  );
};

export default RouteBreadcrumbs;
