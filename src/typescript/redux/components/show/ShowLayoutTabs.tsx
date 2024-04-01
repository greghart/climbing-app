import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import classNames from "classnames";
import type { Location } from "history";

interface Props {
  // Highlight active tab based on current location
  location: Location;
  // Root URL scheme (eg. 'route')
  routeBase: string;
  // Entity we're showing, just needs an id
  entity: {
    id: string | number;
  };
  // Delegate content to children
  children?: React.ReactNode;
}

/**
 * Tabs section of a show layout page
 *
 * Each entity has an overview, comments, and photos.
 * This layout sets up:
 *  * top-level tabs for choosing which sub-page
 *  * assumes a common routing convention `/{entity}/{id}/{overview|comments|photos}?
 */
const ShowLayoutTabs: React.SFC<Props> = (props) => {
  const activeToken = props.location.pathname.split("/")[3];
  const activeLink: "overview" | "comments" | "photos" =
    activeToken === "comments"
      ? "comments"
      : activeToken === "photos"
      ? "photos"
      : activeToken === "overview" || activeToken === undefined
      ? "overview"
      : null;
  console.warn(
    {
      props,
      activeToken,
      activeLink,
    },
    "ShowLayoutTabs"
  );
  return (
    <div className="p-2">
      <ul className="nav nav-tabs nav-justified show-tabs mb-1">
        <li className="nav-item">
          <Link
            to={`/${props.routeBase}/${props.entity.id}/overview`}
            replace
            className={classNames("nav-link", {
              active: activeLink === "overview",
            })}
          >
            <span className="highlight-tab border-primary">Overview</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/${props.routeBase}/${props.entity.id}/comments`}
            replace
            className={classNames("nav-link", {
              active: activeLink === "comments",
            })}
          >
            <span className="highlight-tab border-primary">Comments</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/${props.routeBase}/${props.entity.id}/photos`}
            replace
            className={classNames("nav-link", {
              active: activeLink === "photos",
            })}
          >
            <span className="highlight-tab border-primary">Photos</span>
          </Link>
        </li>
      </ul>
      {props.children}
    </div>
  );
};

// const ConnectedShowLayoutTabs = Omit<Props, 'location'>>(ShowLayoutTabs);
const mapStateToProps = (state) => ({
  location: state.router.location,
});
const ConnectedShowLayoutTabs = connect(mapStateToProps)(ShowLayoutTabs);

export default ConnectedShowLayoutTabs;
export { ShowLayoutTabs as Pure };
