import * as React from "react";

import Area from "../../../models/Area.js";
import AreaBreadcrumbs from "./AreaBreadcrumbs.js";
import ShowLayout, { type RouterProps } from "../show/ShowLayout.js";

type Props = RouterProps & {
  area: Area;
};

const AreaLayout: React.SFC<Props> = (props) => {
  console.warn({ props }, "AreaLayout");
  return (
    <ShowLayout
      {...props}
      headerProps={{
        title: <AreaBreadcrumbs area={props.area} />,
        linkTo: `/explorer/${props.area.crag.id}/${props.area.id}`,
      }}
      tabsProps={{
        routeBase: "areas",
        entity: props.area,
      }}
      extraProps={{
        area: props.area,
      }}
    />
  );
};
AreaLayout.defaultProps = {
  area: {
    id: 1,
    name: "Test Area",
    Areas: [],
    crag: {
      name: "Test Crag",
    },
  } as any,
};

export default AreaLayout;
