import * as React from 'react';

interface Props {
  timestamp: Date | string;
}

function isDate(timestamp: Date | string): timestamp is Date {
  return (timestamp as Date).toISOString !== undefined;
}

const Timestamp: React.SFC<Props> = (props) => {
  if (isDate(props.timestamp)) {
    return <span>{props.timestamp.toISOString()}</span>;
  } else {
    return <span>{props.timestamp}</span>;
  }
}

export default Timestamp;
