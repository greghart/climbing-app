import * as React from "react";
import Crag from "../../../models/Crag.js";
import InfoItem from "../show/InfoItem.js";
import { Link } from "react-router-dom";
import ActionItem from "../show/ActionItem.js";
import AccordionContainer from "../layouts/AccordionContainer.js";

interface Props {
  crag: Crag;
}

const CragLayoutOverview: React.SFC<Props> = (props) => {
  return (
    <React.Fragment>
      <p>{props.crag.description}</p>
      <ul className="list-group">
        <li className="list-group-item list-group-item-action">
          <Link to={`/crags/${props.crag.id}/areas/new`}>
            <ActionItem includeLi={false}>
              Add a new area in this crag
            </ActionItem>
          </Link>
        </li>
        <li className="list-group-item list-group-item-action">
          <Link to={`/crags/${props.crag.id}/trail/new`}>
            <ActionItem includeLi={false}>
              Setup a trail in this crag
            </ActionItem>
          </Link>
        </li>
        <li className="list-group-item list-group-item-action">
          <Link to={`/crags/${props.crag.id}/edit`}>
            <ActionItem includeLi={false}>Edit this crag</ActionItem>
          </Link>
        </li>

        <li className="list-group-item list-group-item-action">
          <AccordionContainer
            scope="crag-layout"
            header={(defaultChevron) => (
              <div className="row align-items-center">
                <div className="col-1">
                  <i className="fa fa-list text-primary" />
                </div>
                <div className="col">
                  {props.crag.areas.length} areas in this crag
                  <span className="ml-2">{defaultChevron}</span>
                </div>
              </div>
            )}
            content={
              <ul className="list-group list-group-flush mt-2">
                {props.crag.areas.map((thisArea) => {
                  return (
                    <Link to={`/areas/${thisArea.id}`} key={thisArea.id}>
                      <InfoItem
                        icon="map-marked"
                        key={`thisArea-${thisArea.id}`}
                      >
                        {thisArea.name}
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

export default CragLayoutOverview;
