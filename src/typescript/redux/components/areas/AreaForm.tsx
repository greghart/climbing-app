import * as React from 'react';
import * as Leaflet from 'leaflet';
import { InjectedFormProps, FormErrors, Fields } from 'redux-form';
import reject = require('lodash/reject');
import { Omit } from 'utility-types/dist/mapped-types';

import Area from '../../../models/Area';
import { OnSubmit } from '../types';
import MyField from '../form/MyField';
import Cancel from '../form/Cancel';
import Submit from '../form/Submit';
import PolygonField, { PolygonFieldProps } from '../form/PolygonField';
import AreasMap from '../explorer/AreasMap';
import AreaBoulders from '../explorer/AreaBoulders';
import fetchCragContainer from '../crags/fetchCragContainer';
import Crag from '../../../models/Crag';
import { ExtractProps } from '../../../externals';
import MyPolygon from '../map/MyPolygon';

interface Props {
  // Crag needed to constrain map bounds for example
  area: Area;
  onSubmit: OnSubmit<FormData, Props>;
  submitErrors: FormErrors<FormData, unknown>;
}

interface FormData {
  name?: string,
  description?: string
}

/**
 * When editing area polygon, we want to show crag areas except this one
 */
type OtherAreasMapProps = Omit<ExtractProps<typeof AreasMap>, 'areas'> & {
  crag: Crag;
  exceptAreaId: number;
}
const _OtherAreasMap: React.ComponentType<OtherAreasMapProps> = (props) => {
  return <AreasMap {...props} areas={reject(props.crag.areas, (a) => a.id === props.exceptAreaId)} />;
}
const OtherAreasMap = fetchCragContainer(_OtherAreasMap)

const AreaForm: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} className="m-3">
      {props.error &&
        <span className="text-danger">{props.error}</span>
      }
      <MyField
        name="name"
        label="Name"
      />
      <MyField
        name="description"
        label="Description"
        inputComponent="textarea"
        rows="3"
      />
      <div className="form-group">
        <label>
          Location
        </label>
        <div>
          <Fields<PolygonFieldProps>
            names={['polygon', 'polygon_is_updating']}
            component={PolygonField}
            bounds={Leaflet.latLng(props.area.crag.center).toBounds(2500)}
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
                  showPolygons={true}
                />
                <AreaBoulders
                  area={props.area}
                />
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
export { FormData, Props };

