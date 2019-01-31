import * as React from 'react';
import Boulder from '../../../models/Boulder';
import InfoItem from '../show/InfoItem';
import { Link } from 'react-router-dom';
import ActionItem from '../show/ActionItem';
import AccordionContainer from '../layouts/AccordionContainer';

interface Props {
  boulder: Boulder;
}

const BoulderLayoutOverview: React.SFC<Props> = (props) => {
  console.warn({ props }, 'BoulderLayoutOverview');
  return (
    <React.Fragment>
      <p>
        {props.boulder.description}
      </p>
      <ul className="list-group">
        <li className="list-group-item list-group-item-action">
          <Link to={`/boulders/${props.boulder.id}/routes/new`}>
            <ActionItem includeLi={false}>
              Add a new route on this boulder
            </ActionItem>
          </Link>
        </li>
        <li className="list-group-item list-group-item-action">
          <Link to={`/boulders/${props.boulder.id}/edit`}>
            <ActionItem includeLi={false}>
              Edit this boulder
            </ActionItem>
          </Link>
        </li>

        <li className="list-group-item list-group-item-action">
          <AccordionContainer
            scope="boulder-layout"
            header={(defaultChevron) => (
              <div className="row align-items-center">
                <div className="col-1">
                  <i className="fa fa-list text-primary"/>
                </div>
                <div className="col">
                  {props.boulder.routes.length} routes on this boulder
                  <span className="ml-2">
                    {defaultChevron}
                  </span>
                </div>
              </div>
            )}
            content={
              <ul className="list-group list-group-flush mt-2">
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
            }
          />
        </li>
      </ul>
    </React.Fragment>
  );
};

export default BoulderLayoutOverview;

