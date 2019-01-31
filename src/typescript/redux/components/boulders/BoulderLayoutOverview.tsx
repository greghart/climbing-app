import * as React from 'react';
import Boulder from '../../../models/Boulder';
import InfoItem from '../show/InfoItem';
import { Link } from 'react-router-dom';

interface Props {
  boulder: Boulder;
}

const BoulderLayoutOverview: React.SFC<Props> = (props) => {
  console.warn({ props }, 'BoulderLayoutOverview');
  return (
    <React.Fragment>
      <p>
        (TODO)Boulder description
      </p>
      <ul className="list-group">
        <Link to={`/boulders/${props.boulder.id}/routes/new`}>
          <li className="list-group-item list-group-item-action">
            <div className="row justify-content-between">
              <div className="col">
                Add a new route on this boulder
              </div>
              <div className="col text-right">
                <i className="fa fa-chevron-right" />
              </div>
            </div>
          </li>
        </Link>
        <InfoItem icon="list">
          {props.boulder.routes.length} routes on this boulder
        </InfoItem>
        {props.boulder.routes.map((thisRoute) => {
          return (
            <Link to={`/routes/${thisRoute.id}`}>
              <InfoItem icon="hand-rock" key={`route-${thisRoute.id}`} >
                {thisRoute.name} ({thisRoute.gradeRaw})
              </InfoItem>
            </Link>
          );
        })}
      </ul>
    </React.Fragment>
  );
};

export default BoulderLayoutOverview;

