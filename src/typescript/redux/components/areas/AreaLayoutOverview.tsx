import * as React from 'react';
import Area from '../../../models/Area';
import InfoItem from '../show/InfoItem';
import { Link } from 'react-router-dom';
import ActionItem from '../show/ActionItem';
import AccordionContainer from '../layouts/AccordionContainer';

interface Props {
  area: Area;
}

const AreaLayoutOverview: React.SFC<Props> = (props) => {
  return (
    <React.Fragment>
      <p>
        {props.area.description}
      </p>
      <ul className="list-group">
        <li className="list-group-item list-group-item-action">
          <Link to={`/areas/${props.area.id}/boulders/new`}>
            <ActionItem includeLi={false}>
              Add a new boulder on this area
            </ActionItem>
          </Link>
        </li>
        <li className="list-group-item list-group-item-action">
          <Link to={`/areas/${props.area.id}/edit`}>
            <ActionItem includeLi={false}>
              Edit this area
            </ActionItem>
          </Link>
        </li>

        <li className="list-group-item list-group-item-action">
          <AccordionContainer
            scope="area-layout"
            header={(defaultChevron) => (
              <div className="row align-items-center">
                <div className="col-1">
                  <i className="fa fa-list text-primary"/>
                </div>
                <div className="col">
                  {props.area.boulders.length} boulders in this area
                  <span className="ml-2">
                    {defaultChevron}
                  </span>
                </div>
              </div>
            )}
            content={
              <ul className="list-group list-group-flush mt-2">
                {props.area.boulders.map((thisBoulder) => {
                  return (
                    <Link to={`/boulders/${thisBoulder.id}`} key={thisBoulder.id}>
                      <InfoItem icon="map-marked" key={`thisBoulder-${thisBoulder.id}`} >
                        {thisBoulder.name}
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

export default AreaLayoutOverview;
