import * as React from 'react';
import * as Leaflet from 'leaflet';
import { InjectedFormProps, FormErrors, Fields, reduxForm } from 'redux-form';

import { OnSubmit } from '../types';
import MyField from '../form/MyField';
import Cancel from '../form/Cancel';
import Submit from '../form/Submit';
import TrailField, { TrailFieldProps } from '../form/TrailField';
import TrailEdge from '../../../models/TrailEdge';
import TrailNode from '../../../models/TrailNode';
import Crag from '../../../models/Crag';

interface Props {
  crag: Crag;
  onSubmit: OnSubmit<FormData, Props>;
  submitErrors: FormErrors<FormData, unknown>;
}

interface FormData {
  trail: {
    nodes: TrailNode[]
  };
}

const CragTrail: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
  return (
    <form onSubmit={props.handleSubmit} className="m-3">
      {props.error &&
        <span className="text-danger">{props.error}</span>
      }
      <Fields<TrailFieldProps>
        names={['trail.nodes', 'trail_is_updating']}
        bounds={
          props.crag.bounds ?
            Leaflet.latLngBounds(
              Leaflet.latLng(props.crag.bounds.topLeft),
              Leaflet.latLng(props.crag.bounds.bottomRight)
            ) :
            Leaflet.latLng(props.crag.center).toBounds(400)
        }
        component={TrailField}
      />

      <div>
        <Submit {...props} />
        <Cancel {...props} />
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'crag-trail-form',
})(CragTrail);
export { FormData, Props };
