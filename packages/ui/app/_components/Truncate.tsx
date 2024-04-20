import * as React from "react";

interface Props {
  text?: string;
  length?: number;
  placeholder?: string;
  reverse?: boolean;
}

export default function Truncate({
  length = 40,
  placeholder = "...",
  ...props
}: Props) {
  if (!props.text) {
    return <React.Fragment />;
  }
  if (props.text.length <= length) {
    return <span>{props.text}</span>;
  }
  const sliceLength = length - placeholder.length;
  const truncated = props.reverse
    ? props.text.slice(Math.max(0, props.text.length - sliceLength))
    : props.text.slice(0, sliceLength);
  return (
    <span title={props.text}>
      {props.reverse && placeholder}
      {truncated}
      {!props.reverse && placeholder}
    </span>
  );
}
Truncate.defaultProps = {
  length: 40,
  placeholder: "...",
  reverse: false,
};
