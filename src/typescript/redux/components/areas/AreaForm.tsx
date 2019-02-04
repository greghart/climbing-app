import * as React from 'react';
import { InjectedFormProps, FormErrors, Fields } from 'redux-form';
import map = require('lodash/map');
import without = require('lodash/without');

import Area from '../../../models/Area';
import { OnSubmit } from '../types';
import MyField from '../form/MyField';
import Cancel from '../form/Cancel';
import Submit from '../form/Submit';
import fetchIdsContainer from './fetchIdsContainer';
import PolygonField from '../form/PolygonField';
import AreasMap from '../explorer/AreasMap';
import AreaBoulders from '../explorer/AreaBoulders';
import AreaPolygon from '../explorer/AreaPolygon';
import { ExtractProps } from '../../../externals';

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

const ConnectAreasMap = fetchIdsContainer(AreasMap)
const AreaForm: React.SFC<InjectedFormProps<FormData> & Props> = (props) => {
  return (
    <form onSubmit={props.handleSubmit} className="m-3">
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
          <Fields
            names={['coordinates', 'coordinates_is_updating']}
            component={PolygonField}
            bounds={props.area.coordinates.map((c) => {
              return [c.lat, c.lng] as [number, number];
            })}
            otherLayers={
              <React.Fragment>
                <AreaPolygon
                  area={props.area}
                  fillOpacity={0.1}
                  fillColor="#f41f5c"
                />
                <ConnectAreasMap
                  areaIds={without(
                    map(
                      (props.area.crag.areas as any),
                      (a) => a.toString()
                    ),
                    props.area.id.toString()
                  )}
                  outlineAreas={true}
                />
                <AreaBoulders
                  area={props.area}
                />
              </React.Fragment>
            }
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

