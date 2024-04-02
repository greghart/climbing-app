import * as React from "react";
import * as Leaflet from "leaflet";
import {
  type InjectedFormProps,
  type FormErrors,
  Fields,
  reduxForm,
} from "redux-form";

import type { OnSubmit } from "../types.js";
import Cancel from "../form/Cancel.js";
import Submit from "../form/Submit.js";
import TrailField, { type TrailFieldProps } from "../form/TrailField.js";
import TrailNode from "../../../models/TrailNode.js";
import Crag from "../../../models/Crag.js";

interface Props {
  crag: Crag;
  onSubmit: OnSubmit<FormData, Props>;
  submitErrors: FormErrors<FormData, unknown>;
}

interface FormData {
  trail: {
    nodes: TrailNode[];
  };
}

const CragTrail: React.SFC<InjectedFormProps<FormData, Props> & Props> = (
  props
) => {
  return (
    <form onSubmit={props.handleSubmit} className="m-3">
      {props.error && <span className="text-danger">{props.error}</span>}
      <Fields<TrailFieldProps>
        names={["trail.nodes", "trail_is_updating"]}
        bounds={
          props.crag.bounds &&
          Leaflet.latLngBounds(
            Leaflet.latLng(props.crag.bounds.topLeft),
            Leaflet.latLng(props.crag.bounds.bottomRight)
          )
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

export default reduxForm<FormData, Props>({
  form: "crag-trail-form",
})(CragTrail);
export type { FormData, Props };
