import Truncate from "../Truncate";
// import RoutesDifficultyBreakdown from "../charts/RoutesDifficultyBreakdown.js";
import { IArea, ICrag } from "models";

type NeededProps = "id" | "name" | "description" | "boulders";
interface Props {
  crag: ICrag;
  area: Pick<IArea, NeededProps>;
}

export default function Area(props: Props) {
  return (
    <>
      <p>
        <Truncate
          length={80}
          text={props.area.description || "Beautiful boulders"}
        />
      </p>
      {/* <RoutesDifficultyBreakdown
        routes={reduce(
          props.area.boulders,
          (memo, thisBoulder) => {
            return memo.concat(thisBoulder.routes || []);
          },
          []
        )}
        height="135px"
      /> */}
    </>
  );
}
