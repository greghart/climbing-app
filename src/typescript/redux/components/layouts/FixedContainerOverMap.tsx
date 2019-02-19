import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

const FixedContainerOverMap: React.ComponentType<Props> = (props) => {
  return (
    <div className="fixed-container over-map">
      <div className="container">
        <div className="row no-gutters pt-3">
          <div className="col">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedContainerOverMap;
