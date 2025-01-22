"use client";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useActionState from "@/app/_components/form/useActionState";
import LineTracer from "@/app/_components/photos/topos/LineTracer";
import TopoCanvas from "@/app/_components/photos/topos/TopoCanvas";
import ShowContentCard from "@/app/_components/show/ShowContentCard";
import putTopo from "@/app/api/_actions/putTopo";
import { Add, Delete, HighlightAlt, LinearScale } from "@mui/icons-material";
import {
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField as MUITextField,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { IPhoto, ITopo, ITopogon } from "models";
import React from "react";

interface Props {
  photo: IPhoto;
  topo?: ITopo;
}

export type Tool = "line";
export default function TopoEditor(props: Props) {
  // Note, we still use `useActionState`, but in reality topo editing cannot be
  // done without a fully functional clientside.
  const [state, formAction, meta] = useActionState(putTopo, {
    ok: true,
    data: props.topo || {
      title: `Topo for ${props.photo.title}`,
      topogons: [],
    },
    meta: {
      photoId: props.photo.id,
      topoId: props.topo?.id,
    },
  });
  const errText = state.fieldErrors?.topogons?.join(", ");
  const [tool, setTool] = React.useState<Tool>("line");
  const [topogons, dispatchTopogons] = React.useReducer(
    topogonsReducer,
    state.data.topogons || []
  );
  const [selectedTopogonId, setSelectedTopogonId] = React.useState<number>(0);
  const selectedTopogon = topogons.find((t) => t.id === selectedTopogonId)!;
  // TODO: Take in the available entities to target -- should be constrained to
  // one topogon per entity
  // TODO: Pass in topo info from tools into the canvas editor
  // TODO: Need to decide serialization of canvas data. Ideally we can always draw
  // a topogon, and maybe we just always store state in such data (serializing and deserializing
  // on every change might be too expensive, but we can always cache as needed -- worth clientside
  // view models at some point?).

  return (
    <form action={formAction}>
      <SubmitSnack kee={meta.reqIndex} {...state} />
      {/* break out */}
      <div style={{ margin: "1em calc(50% - 40vw)" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <TopoCanvas {...props}>
              {(img) => <LineTracer>{img}</LineTracer>}
            </TopoCanvas>
          </Grid>
          <Grid item xs={12} lg={4}>
            <ShowContentCard>
              <Stack spacing={1}>
                <Typography variant="h5">Info</Typography>
                <TextField state={state} name="title" />
                <input
                  name="topogons"
                  type="hidden"
                  value={JSON.stringify(topogons)}
                />
                {errText && (
                  <FormHelperText error>Topogons: {errText}</FormHelperText>
                )}

                <Divider />

                <Typography variant="h5">Topogons</Typography>
                <List sx={{ width: "100%", maxWidth: "480px" }} component="nav">
                  {topogons.map((topogon) => (
                    <ListItem
                      key={topogon.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="go"
                          onClick={() =>
                            dispatchTopogons({
                              type: "removeTopogon",
                              id: topogon.id,
                            })
                          }
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemButton
                        onClick={() => setSelectedTopogonId(topogon.id)}
                        selected={selectedTopogonId === topogon.id}
                      >
                        <ListItemText primary={topogon.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  <ListItemButton
                    onClick={() => dispatchTopogons({ type: "addTopogon" })}
                  >
                    <ListItemIcon>
                      <Add />
                    </ListItemIcon>
                    <ListItemText primary="Add a new topogon" />
                  </ListItemButton>
                </List>

                <Divider />

                {selectedTopogonId !== 0 && (
                  <>
                    <Typography variant="h5">Tools</Typography>
                    <MUITextField
                      label="Topogon Label"
                      value={selectedTopogon.label}
                      onChange={(e) =>
                        dispatchTopogons({
                          type: "updateTopogon",
                          id: selectedTopogonId,
                          update: (t) => ({ ...t, label: e.target.value }),
                        })
                      }
                    />
                    {/** Select for the available entities to target */}
                    <ToggleButtonGroup
                      value={tool}
                      exclusive
                      onChange={(_, value) => value !== null && setTool(value)}
                    >
                      <ToggleButton value="line" aria-label="left aligned">
                        <Tooltip title="Line tool">
                          <LinearScale />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="box" aria-label="centered" disabled>
                        <Tooltip title="Box tool">
                          <HighlightAlt />
                        </Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <Divider />
                  </>
                )}

                <SubmitButton />
              </Stack>
            </ShowContentCard>
          </Grid>
        </Grid>
      </div>
    </form>
  );
}

let _clientId = 0;
function ClientId() {
  // Generate client ids that can be easily known as "client only" on server.
  _clientId--;
  return _clientId;
}

// Manage topogons client side
type TopogonsAction =
  | { type: "addTopogon" }
  | { type: "removeTopogon"; id: number }
  | { type: "updateTopogon"; id: number; update: (t: ITopogon) => ITopogon };
function topogonsReducer(topogons: ITopogon[], action: TopogonsAction) {
  switch (action.type) {
    case "addTopogon":
      return [
        ...topogons,
        {
          id: ClientId(),
          label: "New topogon",
          data: "",
        },
      ];
    case "removeTopogon":
      return topogons.filter((t) => t.id !== action.id);
    case "updateTopogon":
      return topogons.map((t) => {
        if (t.id !== action.id) return t;
        return action.update(t);
      });
  }
}
