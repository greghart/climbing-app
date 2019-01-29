import * as React from 'react';
import * as classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Location } from 'history';

interface Props {
  // Highlight active tab based on current location
  routerLocation: Location;
  // Root URL scheme (eg. 'route')
  routeBase: string;
  // Entity we're showing, just needs an id
  entity: {
    id: string | number;
  }
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
  const activeToken = props.routerLocation.pathname.split('/')[3]
  const activeLink: 'overview' | 'comments' | 'photos' = (
    activeToken == 'comments' ? 'comments':
      activeToken == 'photos' ? 'photos' :
        'overview'
  )
  return (
    <div className="p-2">
      <ul className="nav nav-tabs nav-justified show-tabs mb-1">
        <li className="nav-item">
          <Link
            to={`/${props.routeBase}/${props.entity.id}/overview`}
            replace
            className={classNames('nav-link', { active: activeLink == 'overview' })}
          >
            <span className="highlight-tab border-primary">Overview</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/${props.routeBase}/${props.entity.id}/comments`}
            replace
            className={classNames('nav-link', { active: activeLink == 'comments' })}
          >
            <span className="highlight-tab border-primary">Comments</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/${props.routeBase}/${props.entity.id}/photos`}
            replace
            className={classNames('nav-link', { active: activeLink == 'photos' })}
          >
            <span className="highlight-tab border-primary">(TODO) Photos</span>
          </Link>
        </li>
      </ul>
      {props.children}
    </div>
  );
};

export { Props };
export default ShowLayoutTabs;
