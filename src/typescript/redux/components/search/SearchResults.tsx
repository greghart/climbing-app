import * as React from 'react';
import filter = require('lodash/filter');

import Crag from '../../../models/Crag';
import Area from '../../../models/Area';
import Boulder from '../../../models/Boulder';
import Route from '../../../models/Route';
import getSearchableEntitiesForCrag, { isArea, isBoulder } from './getSearchableEntitiesForCrag';

const _labelMatchesSearch = (label, search = '') => {
  const _label = label.toLowerCase().trim();
  const _search = search.toLowerCase().trim();
  return _label.indexOf(_search) !== -1;
};

interface Props {
  search: string;
  crag: Crag;
}

interface ResultLayoutProps {
  left?: React.ReactNode;
  right: React.ReactNode;
}
const ResultLayout: React.SFC<ResultLayoutProps> = (props) => {
  return (
    <div className="row">
      <div className="col-auto align-self-center">
        {props.left}
      </div>
      <div className="col align-self-center">
        {props.right}
      </div>
    </div>
  )
}
ResultLayout.defaultProps = {
  left: <i className="fa fa-map-marker-alt" />
};

interface AreaProps {
  area: Area;
  crag: Crag;
}
const AreaResult: React.SFC<AreaProps> = (props) => {
  return (
    <ResultLayout 
      right={<React.Fragment>
        <p className="mb-0">{props.area.name}</p>
      </React.Fragment>}
    />
  )
}

interface BoulderProps {
  boulder: Boulder;
  crag: Crag;
}
const BoulderResult: React.SFC<BoulderProps> = (props) => {
  return (
    <ResultLayout 
      right={<React.Fragment>
        <p className="mb-0">{props.boulder.name}</p>
        <small className="text-muted">{props.boulder.area.name}</small>
      </React.Fragment>}
    />
  )
}
interface RouteProps {
  route: Route;
  crag: Crag;
}
const RouteResult: React.SFC<RouteProps> = (props) => {
  return (
    <ResultLayout 
      right={<React.Fragment>
        <p className="mb-0">{props.route.name}</p>
        <small className="text-muted">{props.route.boulder.area.name} | {props.route.boulder.name}</small>
      </React.Fragment>}
    />
  )
}

const SearchResults: React.SFC<Props> = (props) => {
  const results = filter(
    getSearchableEntitiesForCrag(props.crag),
    (thisEntity) => {
      return _labelMatchesSearch(
        thisEntity.name,
        props.search
      )
    }
  )
  console.warn({ 
    props,
    results
  }, 'SearchResults');
  return (
    <ul className="list-group">
      {results.map((thisResult) => {
        return (
          <li 
            className="list-group-item list-group-item-action"
            key={`${thisResult._type}-${thisResult.id}`}
          >
            {isArea(thisResult) ?
              <AreaResult crag={props.crag} area={thisResult} /> :
              isBoulder(thisResult) ?
                <BoulderResult crag={props.crag} boulder={thisResult} /> :
                <RouteResult crag={props.crag} route={thisResult} />
            }
          </li>
        );
      })}
    </ul>
  )
}

export default SearchResults;
