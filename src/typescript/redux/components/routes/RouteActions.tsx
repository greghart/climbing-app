import * as React from 'react';

const RouteActions: React.SFC = () => {
  return (
    <div className="row text-center">
      <button role="button" className="btn btn-link col">
        <i className="fa fa-lg fa-directions" />
        <br/>
        Directions
      </button>
      <button role="button" className="btn btn-link col">
        <i className="fa fa-lg fa-star" />
        <br/>
        Rate
      </button>
      <button role="button" className="btn btn-link col">
        <i className="fa fa-lg fa-dumbbell" />
        <br/>
        Project!
      </button>
    </div>
  );
};

export default RouteActions;
