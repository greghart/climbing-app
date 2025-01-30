"use client";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useActionState from "@/app/_components/form/useActionState";
import TopoCanvas from "@/app/_components/photos/topos/TopoCanvas";
import TopoEditorCanvas from "@/app/_components/photos/topos/TopoEditorCanvas";
import { useTopoEditorStore } from "@/app/_components/photos/topos/TopoEditorStoreProvider";
import TopogonEditorTools from "@/app/_components/photos/topos/TopogonEditorTools";
import ShowContentCard from "@/app/_components/show/ShowContentCard";
import putTopo from "@/app/api/_actions/putTopo";
import { Add, Delete } from "@mui/icons-material";
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
  Stack,
  Typography,
} from "@mui/material";
import { toJS } from "mobx";
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
      scale: 1,
      topogons: [],
    },
    meta: {
      photoId: props.photo.id,
    },
  });
  const errText = state.fieldErrors?.topogons?.join(", ");

  const store = useTopoEditorStore();
  const handleTopogonClick = (id: number) =>
    store.setSelectedTopogonId(id === store.selectedTopogonId ? undefined : id);
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
                setTimeout(() => store.setScale(scale), 50);
                return <TopoEditorCanvas img={img} />;
              }}
            </TopoCanvas>
          </Grid>
          <Grid item xs={12} lg={4}>
            <ShowContentCard>
              <Stack spacing={1}>
                <Typography variant="h5">Info</Typography>
                <TextField state={state} name="title" />
                {state.data.id && (
                  <input name="id" value={state.data.id} type="hidden" />
                )}
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
                        <ListItemText
                          primary={
                            topogon.label && topogon.label !== ""
                              ? topogon.label
                              : store.selectedEntityText(topogon)
                          }
                        />
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
                <TopogonEditorTools />

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
