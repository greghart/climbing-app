import ShowLayout from "@/app/_components/show/ShowLayout";
import finderByID from "@/app/_util/finderByID";
import getArea from "@/app/api/_actions/getArea";

export interface Props {
  children: React.ReactNode;
  params: {
    areaId: string;
  };
}

const getter = finderByID(getArea);

export default async function Layout(props: Props) {
  const area = await getter(props.params.areaId)!;

  return (
    <ShowLayout
      headerProps={{
        title: area.name,
        href: `/crags/${area.crag!.id}/explorer/area/${area.id}`,
      }}
      tabsProps={{
        basePath: `/areas/${area.id}`,
      }}
    >
      {props.children}
    </ShowLayout>
  );
}
