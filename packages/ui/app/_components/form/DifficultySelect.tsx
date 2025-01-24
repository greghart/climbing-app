"use client";

import { IApiResponse } from "@/app/api/ApiResponse";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  TextField as MUITextField,
} from "@mui/material";
import { grades, GradingSystemType } from "models";
import React from "react";

/**
 * Difficulty selector
 * * MUI TextField Select presentation
 * * Easy hook up to `useFormState` and ApiResponse
 */

type Props<Model, Schema extends Partial<Model>> = React.ComponentProps<
  typeof MUITextField
> & {
  state: IApiResponse<Model, Schema, any>;
  name: keyof Schema & keyof Model;
};

export default function DifficultySelect<Model, Schema extends Partial<Model>>({
  state,
  ...props
}: Props<Model, Schema>) {
  const value = state.data![props.name] as string;
  const [plus, setPlus] = React.useState(value[value.length - 1] === "-");
  const [minus, setMinus] = React.useState(value[value.length - 1] === "+");
  const [system, setSystem] = React.useState<GradingSystemType>(
    GradingSystemType.V
  );
  const MenuItems = grades[system];
  return (
    <Grid container spacing={1}>
      <Grid item>
        <MUITextField
          label="System"
          select
          value={system}
          onChange={(e) => {
            setSystem(e.target.value as GradingSystemType);
          }}
        >
          <MenuItem value={GradingSystemType.V}>V-Scale</MenuItem>
          <MenuItem value={GradingSystemType.YDS}>
            Yosemite Decimal System (5.10)
          </MenuItem>
        </MUITextField>
      </Grid>
      <Grid item>
        <MUITextField
          {...props}
          select
          label={props.label || props.name.toUpperCase()}
          fullWidth
          defaultValue={state.data![props.name]}
          error={props.name in (state.fieldErrors || {})}
          helperText={state.fieldErrors?.[props.name]?.join(",")}
        >
          {Object.keys(MenuItems).map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </MUITextField>
      </Grid>
      <Grid item>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={plus}
                onChange={(e) => setPlus(e.target.checked)}
              />
            }
            label="+ (plus)"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={minus}
                onChange={(e) => setMinus(e.target.checked)}
              />
            }
            label="- (minus)"
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
}
