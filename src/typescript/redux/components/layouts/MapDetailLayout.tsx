import * as React from 'react';

interface Props {
  title: string;
  Map: React.ReactNode;
  Detail: React.ReactNode;
}

/**
 * A layout with a title, then a map, then some details
 *
 * Better for PC experiences and places where having a partial map on screen
 * is preferred.
 */
const MapDetailLayout: React.SFC<Props> = (props) => {
  return (
    <div>
      <h2>{props.title}</h2>
      <div className="row">
        <div className="col-md-9">
          {props.Map}
        </div>
        <div className="col-md-3">
          {props.Detail}
        </div>
      </div>
    </div>
  );
};

export default MapDetailLayout;
