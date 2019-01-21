import * as React from 'react';
import RouteActions from './RouteActions';
import Route from '../../../models/Route';

/**
 * A skeleton for an item info entry
 *
 * Aligns an icon and some children
 */
interface InfoProps {
  icon: string;
  children: React.ReactNode;
}
const InfoItem: React.SFC<InfoProps> = (props) => {
  return (
    <li className="list-group-item list-group-item-action">
      <div className="row align-items-center">
        <div className="col-1">
          <i className={`fa fa-${props.icon} text-primary`} />
        </div>
        <div className="col">{props.children}</div>
      </div>
    </li>
  )
}

interface Props {
  myRoute: Route;
}

const RouteLayoutOverview: React.SFC<Props> = (props) => {
  console.warn({ props }, 'RouteLayoutOverview');
  const route = props.myRoute;
  return (
    <React.Fragment>
      <RouteActions />
      <ul className="list-group">
        <li className="list-group-item list-group-item-action">
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
          {route.gradeRaw}
          {route.length && <small> About {route.length}ft. tall</small>}
        </InfoItem>
        <InfoItem icon="check-double">
          (TODO) You climbed this 1 year ago
        </InfoItem>
        <InfoItem icon="list">
          (TODO) 8 people have climbed this
        </InfoItem>
        <InfoItem icon="sun">
          (TODO) This route may have shade right now
        </InfoItem>
        <InfoItem icon="history">
          (TODO) First Ascent by John Long and John Bachar, around 1973
        </InfoItem>
      </ul>
    </React.Fragment>
  );
};

export default RouteLayoutOverview;
