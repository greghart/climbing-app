import * as React from 'react';
import { Circle } from 'react-leaflet';
import { ExtractProps } from '../../../externals';
import { Omit } from 'utility-types/dist/mapped-types';

type KnownProps = 'color' | 'fillColor' | 'radius';
type ExpectedProps = (
  Omit<ExtractProps<typeof Circle>, KnownProps> &
  Partial<Pick<ExtractProps<typeof Circle>, KnownProps>>
);

const ConfirmedCircle: React.ComponentType<ExpectedProps> = React.forwardRef<Circle, ExpectedProps>((props, ref) => {
  return (
    <Circle
      ref={ref}
      color="red"
      fillColor="#f03"
      radius={.1}
      {...props}
    />
  );
});

export default ConfirmedCircle;
