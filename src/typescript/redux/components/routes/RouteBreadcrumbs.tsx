import * as React from 'react';
import Route from '../../../models/Route';
import Truncate from '../Truncate';

interface Props {
  route?: Route;
}

// Breadcrumbs will truncate and allow dropdown
const RouteBreadcrumbs: React.SFC<Props> = (props) => {
  return (
    <div className="dropdown w-100">
      <a
        className="btn btn-link w-100"
        role="button"
        id="breadcrumbsLink"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {/* <Truncate
          text={`${props.route.boulder.area.crag.name} / ${props.route.boulder.area.name} / ${props.route.boulder.name} / ${props.route.name}`}
          length={40}
          reverse={true}
        /> */}
        {props.route.name}
        <i className="fa fa-caret-down ml-2" />
        {/* {`${props.route.boulder.area.crag.name} / ${props.route.boulder.area.name} / ${props.route.boulder.name} / ${props.route.name}`} */}
      </a>
      <div className="dropdown-menu" aria-labelledby="breadcrumbsLink">
        <a className="dropdown-item">{props.route.boulder.area.crag.name}</a>
        <a className="dropdown-item">{props.route.boulder.area.name}</a>
        <a className="dropdown-item">{props.route.boulder.name}</a>
        <a className="dropdown-item">{props.route.name}</a>
      </div>

    </div>
  )
}

export default RouteBreadcrumbs;
