import SearchInput from "@/app/_components/search/SearchInput";
import { Divider } from "@mui/material";
import GoBackHeader from "../layouts/GoBackHeader";

interface Props {
  title: string;
  // Link to for map link
  linkTo: string;
}

/**
 * Header section of a show layout.
 *
 * Simple go back header with a title/breadcrumb and a link back to map
 */
function ShowLayoutHeader(props: Props) {
  return (
    <>
      <GoBackHeader
        input={<SearchInput disabled value={props.title} />}
        prepend={<i className="fa fa-globe" />}
        href={props.linkTo}
      />
      <Divider />
    </>
  );
}

export type { Props };
export default ShowLayoutHeader;
