import * as React from "react";
import * as Leaflet from "leaflet";
import { type InjectedFormProps, type FormErrors, Fields } from "redux-form";
import { reject } from "lodash";
import type { Omit } from "utility-types";

import Area from "../../../models/Area.js";
import type { OnSubmit } from "../types.js";
import MyField from "../form/MyField.js";
import Cancel from "../form/Cancel.js";
import Submit from "../form/Submit.js";
import PolygonField, { type PolygonFieldProps } from "../form/PolygonField.js";
import AreasMap from "../explorer/AreasMap.js";
import AreaBoulders from "../explorer/AreaBoulders.js";
import fetchCragContainer from "../crags/fetchCragContainer.js";
import Crag from "../../../models/Crag.js";
import type { ExtractProps } from "../../../externals.js";
import MyPolygon from "../map/MyPolygon.js";

interface Props {
  // Crag needed to constrain map bounds for example
  area: Area;
  onSubmit: OnSubmit<FormData, Props>;
  submitErrors: FormErrors<FormData, unknown>;
}

interface FormData {
  name?: string;
  description?: string;
}

/**
 * When editing area polygon, we want to show crag areas except this one
 */
type OtherAreasMapProps = Omit<ExtractProps<typeof AreasMap>, "areas"> & {
  crag: Crag;
  exceptAreaId: number;
};
const _OtherAreasMap: React.ComponentType<OtherAreasMapProps> = (props) => {
  return (
    <AreasMap
      {...props}
      areas={reject(props.crag.areas, (a) => a.id === props.exceptAreaId)}
    />
  );
};
const OtherAreasMap = fetchCragContainer(_OtherAreasMap);

const AreaForm: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} className="m-3">
      {props.error && <span className="text-danger">{props.error}</span>}
      <MyField name="name" label="Name" />
      <MyField
        name="description"
        label="Description"
        inputComponent="textarea"
        rows={3}
      />
      <div className="form-group">
        <label>Location</label>
        <div>
          <Fields<PolygonFieldProps>
            names={["polygon", "polygon_is_updating"]}
            component={PolygonField}
            bounds={
              props.area.crag.bounds &&
              Leaflet.latLngBounds(
                Leaflet.latLng(props.area.crag.bounds.topLeft),
                Leaflet.latLng(props.area.crag.bounds.bottomRight)
              )
            }
            otherLayers={(sortedCoordinates) => (
              <React.Fragment>
                <MyPolygon
                  positions={sortedCoordinates}
                  fillOpacity={0.1}
                  fillColor="#f41f5c"
                />
                <OtherAreasMap
                  cragId={props.area.crag.id}
                  exceptAreaId={props.area.id}
                />
                <AreaBoulders area={props.area} />
              </React.Fragment>
            )}
          />
        </div>
      </div>
      <div>
        <Submit {...props} />
        <Cancel {...props} />
      </div>
    </form>
  );
};

export default AreaForm;
export type { FormData, Props };
