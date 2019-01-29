import * as React from 'react';

const RouteActions: React.SFC = () => {
  return (
    <div className="row text-center">
      <button role="button" className="btn btn-link col">
        <i className="fa fa-lg fa-directions" />
        <br/>
        (TODO) Directions
      </button>
      <button role="button" className="btn btn-link col">
        <i className="fa fa-lg fa-star" />
        <br/>
        (TODO) Rate
      </button>
      <button role="button" className="btn btn-link col">
        <i className="fa fa-lg fa-dumbbell" />
        <br/>
        (TODO) Project!
      </button>
    </div>
  );
};

export default RouteActions;
