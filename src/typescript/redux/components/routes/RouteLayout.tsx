import * as React from 'react';
import * as classNames from 'classnames';
import { renderRoutes, RouteConfig } from 'react-router-config';
import { Link } from 'react-router-dom';
import { Location } from 'history';

import PageLayout from '../layouts/PageLayout';
import Route from '../../../models/Route';
import RouteBreadcrumbs from './RouteBreadcrumbs';
import SearchGroup from '../search/SearchGroup';
import GoBackHeader from '../layouts/GoBackHeader';

interface Props {
  route: Route;
  routerConfig: RouteConfig;
  routerLocation: Location;
}

/**
 * Header section of the route layout page
 */
const RouteLayoutHeader: React.SFC<Props> = (props) => {
  return (
    <React.Fragment>
      <GoBackHeader
        groupClass="flex-no-wrap px-3"
        buttonClass="btn-link text-dark"
        prepend={
          <Link to={`/explorer/${props.route.boulder.area.crag.name}`}>
            <i className="fa fa-arrow-left" />
          </Link>
        }
        input={
          <div className="input-group-append flex-grow-up row">
            <div className="col">
              <RouteBreadcrumbs route={props.route} />
            </div>
            <Link to={`/explorer/${props.route.boulder.area.crag.name}/${props.route.boulder.area.name}`}>
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

/**
 * Content section of the route layout page
 *
 * Includes highlevel tabs, and then delegates to sub-children
 */
const RouteLayoutContent: React.SFC<Props> = (props) => {
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
            to={`/route/${props.route.id}/overview`}
            replace
            className={classNames('nav-link', { active: activeLink == 'overview' })}
          >
            <span className="highlight-tab border-primary">Overview</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/route/${props.route.id}/comments`}
            replace
            className={classNames('nav-link', { active: activeLink == 'comments' })}
          >
            <span className="highlight-tab border-primary">Comments</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/route/${props.route.id}/photos`}
            replace
            className={classNames('nav-link', { active: activeLink == 'photos' })}
          >
            <span className="highlight-tab border-primary">(TODO) Photos</span>
          </Link>
        </li>
      </ul>
      {renderRoutes(props.routerConfig.routes, { myRoute: props.route })}
    </div>
  );
};

const RouteLayout: React.SFC<Props> = (props) => {
  return (
    <PageLayout
      key="route"
      header={<RouteLayoutHeader {...props} />}
      content={<RouteLayoutContent {...props} />}
      className={classNames({ 'p-0': true, 'bg-secondary': false, 'bg-white': true })}
    />
  );
}
RouteLayout.defaultProps = {
  route: {
    id: 1,
    name: 'Test Route',
    gradeRaw: 'v12',
    boulder: {
      name: 'EZ Boulder',
      area: {
        name: 'TramWay'
      }
    }
  } as any
};

export default RouteLayout;
