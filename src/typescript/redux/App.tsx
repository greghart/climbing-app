import * as React from 'react';
import { SFC, PropTypes } from 'react';

const App: SFC<any> = (props) => (
  <div className="container">
    {React.cloneElement({...props}.children, {...props})}
  </div>
);

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
