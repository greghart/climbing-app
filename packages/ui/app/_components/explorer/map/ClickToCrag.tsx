import useRouteTo from "@/app/_util/useRouteTo";
import { ICrag } from "models";
import { usePathname } from "next/navigation";
import { useMapEvent } from "react-leaflet/hooks";

interface ClickToCragProps {
  crag: ICrag;
}

export default function ClickToCrag(props: ClickToCragProps) {
  const pathName = usePathname();
  const routeTo = useRouteTo({ includeSearchParams: true });

  const targetUrls = [
    `/crags/${props.crag.id}/explorer`,
    `/crags/${props.crag.name}/explorer`,
  ];

  useMapEvent("click", (e) => {
    if (!e.originalEvent.defaultPrevented && !targetUrls.includes(pathName)) {
      routeTo("../..");
    }
  });

  return null;
}
