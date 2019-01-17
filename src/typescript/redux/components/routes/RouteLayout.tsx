import * as React from 'react';
import * as classNames from 'classnames';
import PageLayout from '../layouts/PageLayout';
import GoBackHeader from '../layouts/GoBackHeader';
import Route from '../../../models/Route';
import RouteBreadcrumbs from './RouteBreadcrumbs';
import RouteActions from './RouteActions';

interface Props {
  route?: Route;
}

interface InfoProps {
  icon: string;
  children: React.ReactNode;
}

const InfoItem: React.SFC<InfoProps> = (props) => {
  return (
    <li className="list-group-item">
      <div className="row align-items-center">
        <div className="col-1">
          <i className={`fa fa-${props.icon} text-primary`} />
        </div>
        <div className="col">{props.children}</div>
      </div>
    </li>
  )
}
const RouteLayout: React.SFC<Props> = (props) => {
  console.warn({ props }, 'ROuteLayout')
  return (
    <PageLayout
      key="route"
      header={
        <React.Fragment>
          <GoBackHeader
            groupClass="flex-no-wrap px-3"
            buttonClass="btn-link text-dark"
            input={
              <div className="input-group-append flex-grow-up">
                <RouteBreadcrumbs route={props.route} />
              </div>
            }
          />
          <hr className="m-0" />
        </React.Fragment>
      }
      content={
        <div className="p-2">
          <ul className="nav nav-tabs nav-justified show-tabs mb-1">
            <li className="nav-item">
              <a className="nav-link active">
                <span className="highlight-tab border-primary">Overview</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link">
                <span className="highlight-tab border-primary">Comments</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link">
                <span className="highlight-tab border-primary">Photos</span>
              </a>
            </li>
          </ul>
          <RouteActions />
          <ul className="list-group">
            <li className="list-group-item">
              <div className="row justify-content-between">
                <div className="col">
                  More about this climb
                </div>
                <div className="col text-right">
                  <i className="fa fa-chevron-right" />
                </div>
              </div>
            </li>
            <InfoItem icon="hand-rock">
              {props.route.gradeRaw}
              {props.route.length && <small> About {props.route.length}ft. tall</small>}
            </InfoItem>
            <InfoItem icon="check-double">
              You climbed this 1 year ago
            </InfoItem>
            <InfoItem icon="list">
              8 people have climbed this
            </InfoItem>
            <InfoItem icon="sun">
              This route may have shade right now
            </InfoItem>
            <InfoItem icon="history">
              First Ascent by John Long and John Bachar, around 1973
            </InfoItem>
          </ul>
        </div>
      }
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
