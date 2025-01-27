"use client";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useActionState from "@/app/_components/form/useActionState";
import TopoCanvas from "@/app/_components/photos/topos/TopoCanvas";
import TopoEditorCanvas from "@/app/_components/photos/topos/TopoEditorCanvas";
import { useTopoEditorStore } from "@/app/_components/photos/topos/TopoEditorStoreProvider";
import ShowContentCard from "@/app/_components/show/ShowContentCard";
import putTopo from "@/app/api/_actions/putTopo";
import {
  Add,
  AdsClick,
  Delete,
  HighlightAlt,
  Label,
  LinearScale,
} from "@mui/icons-material";
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
  MenuItem,
  TextField as MUITextField,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { action, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { IPhoto } from "models";

interface Props {
  photo: IPhoto;
}

/**
 * Root component for editing and saving the topo for given photo
 * * Canvas for displaying topogons and editing them when selected
 * * Topo panel for changing title and selecting, adding, removing topogons
 * * Topogon panel for editing the selected topogon, if any, including canvas tool
 */
function TopoEditor(props: Props) {
  // Note, we still use `useActionState`, but in reality topo editing cannot be
  // done without a fully functional clientside.
  const [state, formAction, meta] = useActionState(putTopo, {
    ok: true,
    data: props.photo?.topo || {
      title: `Topo for ${props.photo.title}`,
      topogons: [],
    },
    meta: {
      photoId: props.photo.id,
      topoId: props.photo.topo?.id,
    },
  });
  const errText = state.fieldErrors?.topogons?.join(", ");

  const store = useTopoEditorStore();
  const topogonStore = store.topogonEditor;
  const handleTopogonClick = (id: number) =>
    store.setSelectedTopogonId(id === store.selectedTopogonId ? undefined : id);
  const theme = useTheme();
  // TODO: Take in the available entities to target -- should be constrained to
  // one topogon per entity
  return (
    <form action={formAction}>
      <SubmitSnack kee={meta.reqIndex} {...state} />
      {/* break out */}
      <div style={{ margin: "1em calc(50% - 40vw)" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <TopoCanvas {...props}>
              {/** TODO: Refactor to separate component?? */}
              {(img, scale) => {
                store.setScale(scale);
                return <TopoEditorCanvas img={img} />;
              }}
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
                  value={JSON.stringify(toJS(store.topogons))}
                />
                <input name="scale" type="hidden" value={store.scale} />
                {errText && (
                  <FormHelperText error>Topogons: {errText}</FormHelperText>
                )}

                <Divider />

                <Typography variant="h5">Topogons</Typography>
                <List sx={{ width: "100%", maxWidth: "480px" }} component="nav">
                  {store.topogons.map((topogon) => (
                    <ListItem
                      key={topogon.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="go"
                          onClick={() => store.removeTopogon(topogon.id)}
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemButton
                        onClick={() => handleTopogonClick(topogon.id)}
                        selected={
                          store.selectedTopogonId === topogon.id ||
                          store.hoveredTopogonId === topogon.id
                        }
                      >
                        <ListItemText primary={topogon.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  <ListItemButton onClick={() => store.addTopogon()}>
                    <ListItemIcon>
                      <Add />
                    </ListItemIcon>
                    <ListItemText primary="Add a new topogon" />
                  </ListItemButton>
                </List>

                <Divider />

                {/** TODO: Refactor to tool component */}
                {topogonStore && (
                  <>
                    <Typography variant="h5">Tools</Typography>
                    <MUITextField
                      label="Topogon Label"
                      value={topogonStore.topogon.label}
                      onChange={action((e) => {
                        topogonStore.topogon.label = e.target.value;
                      })}
                    />
                    {/** Select for the available entities to target */}
                    <ToggleButtonGroup
                      value={topogonStore.tool}
                      exclusive
                      onChange={(_, value) =>
                        value !== null && topogonStore.setTool(value)
                      }
                    >
                      <ToggleButton value="pointer">
                        <Tooltip title="Pointer tool">
                          <AdsClick />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="line">
                        <Tooltip title="Line tool">
                          <LinearScale />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="label">
                        <Tooltip title="Label tool">
                          <Label />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="box" aria-label="centered" disabled>
                        <Tooltip title="Box tool">
                          <HighlightAlt />
                        </Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>
                    {topogonStore.tool === "line" && (
                      <>
                        <Typography variant="body2">
                          Click to add lines.
                        </Typography>
                        <Typography variant="body2">
                          Z to undo last line.
                        </Typography>
                        <Typography variant="body2">
                          Space to finish line.
                        </Typography>
                        <Typography variant="body2">
                          X to remove line.
                        </Typography>
                        <MUITextField
                          label="Tension"
                          type="number"
                          value={
                            topogonStore.selectedLine?.tension ||
                            topogonStore.defaultLineTension
                          }
                          onChange={(e) => {
                            if (Number.isFinite(parseFloat(e.target.value))) {
                              topogonStore.setLineTension(
                                parseFloat(e.target.value)
                              );
                            }
                          }}
                        />
                        <MUITextField
                          label="Line color"
                          select
                          value={
                            topogonStore.selectedLine?.color ||
                            topogonStore.defaultColor
                          }
                          onChange={(e) =>
                            topogonStore.setLineColor(e.target.value)
                          }
                        >
                          {[
                            theme.palette.primary,
                            theme.palette.secondary,
                            theme.palette.error,
                            theme.palette.warning,
                            theme.palette.info,
                            theme.palette.success,
                          ].map((color) => (
                            <MenuItem key={color.main} value={color.dark}>
                              <Typography style={{ color: color.dark }}>
                                {color.dark}
                              </Typography>
                            </MenuItem>
                          ))}
                        </MUITextField>
                      </>
                    )}
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

export default observer(TopoEditor);
