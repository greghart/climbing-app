import * as React from "react";
import Boulder from "../../../models/Boulder.js";
import InfoItem from "../show/InfoItem.js";
import { Link } from "react-router-dom";
import ActionItem from "../show/ActionItem.js";
import AccordionContainer from "../layouts/AccordionContainer.js";
import BoulderMap from "./BoulderMap.js";
import InlineMap from "../map/InlineMap.js";
import LinkItem from "../show/LinkItem.js";

interface Props {
  boulder: Boulder;
}

const BoulderLayoutOverview: React.SFC<Props> = (props) => {
  console.warn({ props }, "BoulderLayoutOverview");
  return (
    <React.Fragment>
      <p>{props.boulder.description}</p>
      <ul className="list-group">
        {/* Boulder map */}
        <li className="list-group-item p-1">
          {props.boulder.polygon && (
            <InlineMap boundsCoordinates={props.boulder.polygon.coordinates}>
              <BoulderMap boulder={props.boulder} />
            </InlineMap>
          )}
        </li>

        {/* New route action */}
        <li className="list-group-item list-group-item-action">
          <Link to={`/boulders/${props.boulder.id}/routes/new`}>
            <ActionItem includeLi={false}>
              Add a new route on this boulder
            </ActionItem>
          </Link>
        </li>

        {/* Edit boulder action */}
        <li className="list-group-item list-group-item-action">
          <Link to={`/boulders/${props.boulder.id}/edit`}>
            <ActionItem includeLi={false}>Edit this boulder</ActionItem>
          </Link>
        </li>

        {/* Sun angles inline */}
        <LinkItem to={`/boulders/${props.boulder.id}/sun`} icon="sun">
          View sun angles on boulder
        </LinkItem>

        {/* <li className="list-group-item list-group-item-action">
          <AccordionContainer
            scope="boulder-sun"
            header={(defaultChevron) => (
              <InfoItem icon="sun" includeLi={false}>
                Sun Angles on Boulder
                <span className="ml-2">
                  {defaultChevron}
                </span>
              </InfoItem>
            )}
            content={
              <InlineMap
                className="m-1"
                boundsCoordinates={props.boulder.polygon.coordinates}
              >
                <BoulderMap boulder={props.boulder} />
              </InlineMap>
            }
          />
        </li> */}

        {/* Route list inline */}
        <li className="list-group-item list-group-item-action">
          <AccordionContainer
            scope="boulder-layout"
            header={(defaultChevron) => (
              <InfoItem icon="list" includeLi={false}>
                {props.boulder.routes.length} routes on this boulder
                <span className="ml-2">{defaultChevron}</span>
              </InfoItem>
            )}
            content={
              <ul className="list-group list-group-flush mt-2">
                {props.boulder.routes.map((thisRoute) => {
                  return (
                    <Link to={`/routes/${thisRoute.id}`} key={thisRoute.id}>
                      <InfoItem icon="hand-rock" key={`route-${thisRoute.id}`}>
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
