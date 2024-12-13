"use client";
import { searchParamsParsers } from "@/app/_components/search/searchParams";
import useQueryState from "@/app/_util/useQueryState";
import { Slider } from "@mui/material";

export default function DifficultySlider() {
  const [difficultyMin, setDifficultyMin] = useQueryState(
    "vMin",
    searchParamsParsers.vMin
  );
  const [difficultyMax, setDifficultyMax] = useQueryState(
    "vMax",
    searchParamsParsers.vMax
  );
  // Showing and storing v scale, will map to value under hood
  // VB - V17
  const ticks = 18;

  // TODO: Would be nice to use grades lib for this instead of knowing values
  const marks = Array(ticks)
    .fill(0)
    .map((_, i) => {
      const value = i * 10;
      if (i % 2 === 1) return { value };
      return {
        value: value,
        label: `${i === 0 ? "VB" : `V${i}`}`,
      };
    });
  console.log(marks);
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
