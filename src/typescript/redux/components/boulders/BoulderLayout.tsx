import * as React from "react";

import Boulder from "../../../models/Boulder";
import BoulderBreadcrumbs from "./BoulderBreadcrumbs";
import ShowLayout, { type RouterProps } from "../show/ShowLayout";

type Props = RouterProps & {
  boulder: Boulder;
};

// TODO Implement reverse routing for nicer links.
const exploreBoulder = (boulder: Boulder) => {
  return `/explorer/${boulder.area.crag.id}/${boulder.area.id}/${boulder.id}`;
};
const BoulderLayout: React.SFC<Props> = (props) => {
  console.warn({ props }, "BoulderLayout");
  return (
    <ShowLayout
      {...props}
      headerProps={{
        title: <BoulderBreadcrumbs boulder={props.boulder} />,
        linkTo: exploreBoulder(props.boulder),
      }}
      tabsProps={{
        routeBase: "boulders",
        entity: props.boulder,
      }}
      extraProps={{
        boulder: props.boulder,
      }}
    />
  );
};
BoulderLayout.defaultProps = {
  boulder: {
    id: 1,
    name: "Test Boulder",
    routes: [
      {
        id: 1,
        name: "Test Route",
        gradeRaw: "v12",
      },
    ],
    area: {
      name: "Test Area",
      crag: {
        name: "Test Crag",
      },
    },
  } as any,
};

export default BoulderLayout;
