import { Map } from "@mui/icons-material";
import React from "react";
import GoBackHeader from "../layouts/GoBackHeader";

type Props = React.ComponentProps<typeof GoBackHeader> & {
  title: string;
};

/**
 * Header section of a show layout.
 *
 * Simple go back header with a title/breadcrumb and a link back to map
 */
function ShowLayoutHeader(props: Props) {
  return (
    <GoBackHeader disabled {...props} value={props.title} prepend={<Map />} />
  );
}

export type { Props };
export default ShowLayoutHeader;
