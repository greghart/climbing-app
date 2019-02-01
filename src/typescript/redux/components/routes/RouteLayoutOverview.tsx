import * as React from 'react';
import { Link } from 'react-router-dom';
import RouteActions from './RouteActions';
import Route from '../../../models/Route';
import InfoItem from '../show/InfoItem';
import ActionItem from '../show/ActionItem';

interface Props {
  myRoute: Route;
}

const RouteLayoutOverview: React.SFC<Props> = (props) => {
  console.warn({ props }, 'RouteLayoutOverview');
  const route = props.myRoute;
  return (
    <React.Fragment>
      <RouteActions />
      <p>
        {props.myRoute.description}
      </p>
      <ul className="list-group">
        <li className="list-group-item list-group-item-action">
          <Link to={`/routes/${props.myRoute.id}/edit`}>
            <ActionItem includeLi={false}>
              Edit this route
            </ActionItem>
          </Link>
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
