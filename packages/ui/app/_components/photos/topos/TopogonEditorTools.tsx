"use client";
import theme from "@/app/_components/photos/topos/theme";
import { useTopogonEditorStore } from "@/app/_components/photos/topos/TopoEditorStoreProvider";
import TopogonEditorStore from "@/app/_components/photos/topos/TopogonEditorStore";
import {
  AdsClick,
  HighlightAlt,
  Label,
  LinearScale,
} from "@mui/icons-material";
import {
  Divider,
  MenuItem,
  TextField as MUITextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";

interface Props {}
function _TopogonEditorTools(props: Props) {
  const store = useTopogonEditorStore();
  if (!store) return false;

  return (
    <>
      <Typography variant="h5">Tools</Typography>
      <MUITextField
        label="Topogon Label"
        value={store.topogon.label}
        onChange={action((e) => {
          store.topogon.label = e.target.value;
        })}
      />
      {/** Select for the available entities to target */}
      <ToggleButtonGroup
        value={store.tool}
        exclusive
        onChange={(_, value) => value !== null && store.setTool(value)}
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
      {store.tool === "line" && <LineTool store={store} />}
      {store.tool === "pointer" && <PointerTool store={store} />}
      {store.tool === "label" && <LabelTool store={store} />}
      <Divider />
    </>
  );
}
const TopogonEditorTools = observer(_TopogonEditorTools);
export default TopogonEditorTools;

function _LabelTool({ store }: { store: TopogonEditorStore }) {
  return (
    <>
      <Typography variant="body2">Click to add label.</Typography>
      <Typography variant="body2">X to remove label.</Typography>
      <MUITextField
        label="Label"
        value={store.selectedLabel?.text || store.defaultLabelText}
        onChange={(e) => {
          store.selectedLabel?.setText(e.target.value);
          store.setLineTension(parseFloat(e.target.value));
        }}
      />
      <ColorPicker
        label="Background color"
        value={store.selectedLabel?.fill || store.defaultColor}
        onChange={(e) => store.setColor(e.target.value)}
      />
      <ColorPicker
        label="Text Color"
        value={store.selectedLabel?.color || store.defaultFillColor}
        onChange={(e) => store.setFill(e.target.value)}
      />
    </>
  );
}
const LabelTool = observer(_LabelTool);

function _LineTool({ store }: { store: TopogonEditorStore }) {
  return (
    <>
      <Typography variant="body2">Click to add lines.</Typography>
      <Typography variant="body2">Z to undo last line.</Typography>
      <Typography variant="body2">Space to finish line.</Typography>
      <Typography variant="body2">X to remove line.</Typography>
      <MUITextField
        label="Tension"
        type="number"
        value={store.selectedLine?.tension || store.defaultLineTension}
        onChange={(e) => {
          if (Number.isFinite(parseFloat(e.target.value))) {
            store.setLineTension(parseFloat(e.target.value));
          }
        }}
      />
      <ColorPicker
        value={store.selectedLine?.color || store.defaultColor}
        onChange={(e) => store.setColor(e.target.value)}
      />
    </>
  );
}
const LineTool = observer(_LineTool);

function _PointerTool({ store }: { store: TopogonEditorStore }) {
  return (
    <>
      <Typography variant="body2">Click to select components.</Typography>
      <Typography variant="body2">Drag to move.</Typography>
    </>
  );
}
const PointerTool = observer(_PointerTool);

function ColorPicker(props: React.ComponentProps<typeof MUITextField>) {
  const colors = ["green", "blue", "yellow", "red", "purple"] as const;
  return (
    <MUITextField label="Line color" select {...props}>
      {colors
        .map((c) => {
          const color = theme.palette[c];
          return [
            <MenuItem key={color.dark} value={color.dark}>
              <Typography
                style={{
                  color: color.dark,
                  backgroundColor: color.contrastText,
                }}
              >
                {c} (Dark)
              </Typography>
            </MenuItem>,
            <MenuItem key={color.main} value={color.main}>
              <Typography
                style={{
                  color: color.main,
                  backgroundColor: color.contrastText,
                }}
              >
                {c} (Main)
              </Typography>
            </MenuItem>,
            <MenuItem key={color.light} value={color.light}>
              <Typography
                style={{
                  color: color.light,
                  backgroundColor: color.contrastText,
                }}
              >
                {c} (Light)
              </Typography>
            </MenuItem>,
          ];
        })
        .flat()}
      <MenuItem key={"white"} value={"#ffffff"}>
        <Typography
          style={{
            color: "#ffffff",
            backgroundColor: "black",
          }}
        >
          White
        </Typography>
      </MenuItem>
      <MenuItem key={"black"} value={"#000000"}>
        <Typography
          style={{
            color: "#000000",
            backgroundColor: "white",
          }}
        >
          Black
        </Typography>
      </MenuItem>
    </MUITextField>
  );
}
