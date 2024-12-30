"use client";
import { searchParamsParsers } from "@/app/_components/search/searchParams";
import useQueryState from "@/app/_util/useQueryState";
import { Slider } from "@mui/material";
import { grades } from "models";

export default function DifficultySlider() {
  const [difficultyMin, setDifficultyMin] = useQueryState(
    "vMin",
    searchParamsParsers.vMin
  );
  const [difficultyMax, setDifficultyMax] = useQueryState(
    "vMax",
    searchParamsParsers.vMax
  );
  // VB - V17
  const marks = Object.values(grades.V).map((g) => ({
    value: g.value,
    label: g.raw,
  }));
  return (
    <Slider
      aria-label="v scale"
      value={[difficultyMin, difficultyMax]}
      max={marks[marks.length - 1].value}
      step={null}
      marks={marks}
      onChange={(_, _values: unknown) => {
        const values = _values as [number, number];
        setDifficultyMin(values[0]);
        setDifficultyMax(values[1]);
      }}
      valueLabelDisplay="off"
      valueLabelFormat={(_, i) => marks[i].label}
    />
  );
}
