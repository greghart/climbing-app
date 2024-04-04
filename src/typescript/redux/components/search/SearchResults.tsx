import * as React from "react";
import { filter } from "lodash-es";
import { Link } from "react-router-dom";

import Crag from "../../../models/Crag.js";
import Area from "../../../models/Area.js";
import Boulder from "../../../models/Boulder.js";
import Route from "../../../models/Route.js";
import type { FormData as SearchFilterFormData } from "./SearchFilters.js";
import getSearchableEntitiesForCrag, {
  isArea,
  isBoulder,
  isRoute,
  type Tag,
  type Searchable,
} from "./getSearchableEntitiesForCrag.js";
import getNormalizedSunValueForRoute from "../sun/getNormalizedSunValueForRoute.js";

type GetMatcher = (...args: any[]) => (s: Searchable) => boolean;
const searchMatcher: GetMatcher = (search = "") => {
  const _search = search.toLowerCase().trim();
  return (s: Searchable) => {
    return s.name.toLowerCase().trim().indexOf(_search) !== -1;
  };
};
const typeMatcher: GetMatcher = (type: Tag | "any") => {
  if (!type || type === "any") {
    return (s) => true;
  }
  return (s) => {
    return s._type === type;
  };
};
const sunMatcher: GetMatcher = (apply: boolean = false, givenHour: number) => {
  if (!apply) {
    return (s) => true;
  }
  const time = new Date();
  if (givenHour) {
    time.setHours(givenHour);
  }
  return (s) => {
    if (!isRoute(s)) {
      return false;
    }
    const sunValue = getNormalizedSunValueForRoute(s, time);
    // Totally arbitrary :o
    return sunValue < 0.6 && sunValue > 0;
  };
};

interface Props {
  search: string;
  crag: Crag;
  form: SearchFilterFormData;
}

interface ResultLayoutProps {
  left?: React.ReactNode;
  right: React.ReactNode;
}
const ResultLayout: React.SFC<ResultLayoutProps> = (props) => {
  return (
    <div className="row">
      <div className="col-auto align-self-center">{props.left}</div>
      <div className="col align-self-center">{props.right}</div>
    </div>
  );
};
ResultLayout.defaultProps = {
  left: <i className="fa fa-map-marker-alt" />,
};

interface AreaProps {
  area: Area;
  crag: Crag;
}
const AreaResult: React.SFC<AreaProps> = (props) => {
  return (
    <Link to={`/areas/${props.area.id}`}>
      <ResultLayout
        right={
          <React.Fragment>
            <p className="mb-0">{props.area.name}</p>
          </React.Fragment>
        }
      />
    </Link>
  );
};

interface BoulderProps {
  boulder: Boulder;
  crag: Crag;
}
const BoulderResult: React.SFC<BoulderProps> = (props) => {
  return (
    <Link to={`/boulders/${props.boulder.id}`}>
      <ResultLayout
        right={
          <React.Fragment>
            <p className="mb-0">{props.boulder.name}</p>
            <small className="text-muted">{props.boulder.area.name}</small>
          </React.Fragment>
        }
      />
    </Link>
  );
};
interface RouteProps {
  route: Route;
  crag: Crag;
}
const RouteResult: React.SFC<RouteProps> = (props) => {
  return (
    <Link to={`/routes/${props.route.id}`}>
      <ResultLayout
        right={
          <React.Fragment>
            <p className="mb-0">
              {props.route.name} ({props.route.gradeRaw})
            </p>
            <small className="text-muted">
              {props.route.boulder.area.name} | {props.route.boulder.name}
            </small>
          </React.Fragment>
        }
      />
    </Link>
  );
};

const SearchResults: React.SFC<Props> = (props) => {
  const filterSearch = searchMatcher(props.search);
  const filterType = typeMatcher(props.form.entityType);
  const filterSun = sunMatcher(
    props.form.filterShade,
    props.form.shadeAtHour / 4
  );
  const results = filter(
    getSearchableEntitiesForCrag(props.crag),
    (thisEntity) => {
      return (
        filterType(thisEntity) &&
        filterSearch(thisEntity) &&
        filterSun(thisEntity)
      );
    }
  );
  return (
    <ul className="list-group">
      {results.map((thisResult) => {
        return (
          <li
            className="list-group-item list-group-item-action"
            key={`${thisResult._type}-${thisResult.id}`}
          >
            {isArea(thisResult) ? (
              <AreaResult crag={props.crag} area={thisResult} />
            ) : isBoulder(thisResult) ? (
              <BoulderResult crag={props.crag} boulder={thisResult} />
            ) : (
              <RouteResult crag={props.crag} route={thisResult} />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default SearchResults;
