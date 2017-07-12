import * as React from 'react';
import { ReactNode, SFC } from 'react';

interface Props {
  title: string;
  Map: ReactNode;
  Detail: ReactNode;
}

const MapDetailLayout: SFC<Props> = (props) => {
  return (
    <div>
      <h2>{props.title}</h2>
      <div className='row'>
        <div className='col-md-9'>
          {props.Map}
        </div>
        <div className='col-md-3'>
          {props.Detail}
        </div>
      </div>
    </div>
  )
};

export default MapDetailLayout;
