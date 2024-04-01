import * as React from "react";
import GoBackHeader from "../layouts/GoBackHeader";
import { Link } from "react-router-dom";

interface Props {
  title: React.ReactNode;
  // Link to for map link
  linkTo: string;
}

/**
 * Header section of a show layout.
 *
 * Simple go back header with a title/breadcrumb and a link back to map
 */
const ShowLayoutHeader: React.SFC<Props> = (props) => {
  return (
    <React.Fragment>
      <GoBackHeader
        groupClass="flex-no-wrap px-3"
        buttonClass="btn-link text-dark"
        input={
          <div className="input-group-append flex-grow-up row">
            <div className="col">{props.title}</div>
            <Link to={props.linkTo}>
              <div className="col-auto pt-2">
                <i className="fa fa-globe" />
              </div>
            </Link>
          </div>
        }
      />
      <hr className="m-0" />
    </React.Fragment>
  );
};

export type { Props };
export default ShowLayoutHeader;
