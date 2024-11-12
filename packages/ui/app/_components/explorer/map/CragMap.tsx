import BaseCragMap from "@/app/_components/map/CragMap";
import ClickToCrag from "./ClickToCrag";

type Props = React.ComponentProps<typeof BaseCragMap>;

export default function CragMap(props: Props) {
  return (
    <BaseCragMap {...props}>
      <ClickToCrag crag={props.crag} />
      {props.children}
    </BaseCragMap>
  );
}
