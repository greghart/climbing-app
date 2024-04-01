/**
 * Search filters to set
 */
import * as React from "react";
import { type InjectedFormProps, reduxForm } from "redux-form";

import type { OnSubmit } from "../types";
import type { Tag } from "./getSearchableEntitiesForCrag";
import MyField from "../form/MyField";
import SunHoursField from "../sun/SunHoursField";
import Crag from "../../../models/Crag";
import Coordinate from "../../../models/Coordinate";

interface Props {
  crag?: Crag;
  onSubmit: OnSubmit<FormData, Props>;
}

interface FormData {
  entityType?: Tag;
  filterShade: boolean;
  shadeAtHour: number;
}

const _SearchFilters: React.SFC<InjectedFormProps<FormData, Props> & Props> = (
  props
) => {
  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} className="m-3">
      <MyField
        inputComponent="select"
        name="entityType"
        label="Search for a specific entity type?"
      >
        <option value="any">Any</option>
        <option value="route">Routes</option>
        <option value="boulder">Boulders</option>
        <option value="area">Areas</option>
      </MyField>
      <MyField
        type="checkbox"
        label="Only show shady-ish routes at:"
        name="filterShade"
      />
      <SunHoursField
        name="shadeAtHour"
        coordinate={new Coordinate(32.85052, -117.02223)}
        className="mb-4"
      />
    </form>
  );
};

const SearchFilters = reduxForm<FormData, Props>({
  initialValues: {
    filterShade: false,
    shadeAtHour: new Date().getHours() * 4,
  },
  form: "search-form",
})(_SearchFilters);

export type { FormData };
export default SearchFilters;
