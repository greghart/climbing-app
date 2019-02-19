import * as React from 'react';

interface Props {
  text?: string;
  length?: number;
  placeholder?: string;
  reverse?: boolean;
}

const Truncate: React.SFC<Props> = (props) => {
  const sliceLength = props.length - props.placeholder.length;
  const truncated = props.reverse ?
    props.text.slice(
      Math.max(0, props.text.length - sliceLength),
    ) :
    props.text.slice(
      0,
      props.text.length - sliceLength,
    );
  return (
    <span title={props.text}>
      {props.reverse && props.placeholder}{truncated}{!props.reverse && props.placeholder}
    </span>
  );
};
Truncate.defaultProps = {
  text: '',
  length: 40,
  placeholder: '...',
  reverse: false,
};

export default Truncate;
