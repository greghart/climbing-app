"use client";
import { searchParamsParsers } from "@/app/_components/search/searchParams";
import useQueryState from "@/app/_util/useQueryState";
import { Slider } from "@mui/material";
import { ICoordinateLiteral } from "models";
import * as SunCalc from "suncalc";

interface Props {
  coordinate: ICoordinateLiteral;
}

export default function SunHoursField(props: Props) {
  const [hour, setHour] = useQueryState(
    "shadeHour",
    searchParamsParsers.shadeHour
  );
  // 1 tick for each hour that the sun is out at all
  const times = SunCalc.getTimes(
    new Date(),
    props.coordinate.lat,
    props.coordinate.lng
  );
  const bottomHour = Math.floor(times.sunrise.getHours());
  const actualTopHour = Math.floor(times.sunset.getHours());
  // Only label every other tick to save space
  // If there are odd # of hours, we can easily show every other tick
  // If even it's not so easy, so just add one arbitrarily if needed
  const topHour =
    (actualTopHour - bottomHour) % 2 == 0 ? actualTopHour : actualTopHour + 1;
  const totalTicks = (topHour - bottomHour) / 2 + 1;

  let shownAmPm = false;
  const marks = Array(totalTicks)
    .fill(0)
    .map((_, i) => {
      const value = bottomHour + i * 2;
      const showAmPm =
        (!shownAmPm && value >= 12) || i == 0 || i == totalTicks - 1;
      shownAmPm = value >= 12;
      const amPm = shownAmPm ? "PM" : "AM";
      return {
        value: value,
        label: `${value === 12 ? 12 : value % 12}${showAmPm ? amPm : ""}`,
      };
    });
  return (
    <Slider
      aria-label="hour of day"
      defaultValue={bottomHour}
      min={bottomHour}
      max={topHour}
      marks={marks}
      step={1}
      value={hour}
      onChange={(_, value) => setHour(value as number)}
      valueLabelDisplay="auto"
      valueLabelFormat={(value) => `${value % 12}${value >= 12 ? "PM" : "AM"}`}
    />
  );
}
