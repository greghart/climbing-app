import * as React from 'react';

interface Props {
  sunValue: number;
}

const DisplaySunValue: React.FunctionComponent<Props> = (props) => {
  if (props.sunValue > .75) {
    return <span>Very Sunny</span>;
  }
  if (props.sunValue > .6) {
    return <span>Sunny</span>;
  }
  if (props.sunValue > .4) {
    return <span>Right in the middle</span>;
  }
  if (props.sunValue > .25) {
    return <span>Shady</span>;
  }
  return <span>Very Shady</span>;
};

export default DisplaySunValue;
