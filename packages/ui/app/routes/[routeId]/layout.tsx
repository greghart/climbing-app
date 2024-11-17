import ShowLayout from "@/app/_components/show/ShowLayout";
import finderByID from "@/app/_util/finderByID";
import getRoute from "@/app/api/_actions/getRoute";

export interface Props {
  children: React.ReactNode;
  params: {
    routeId: string;
  };
}

const getter = finderByID(getRoute);

export default async function Layout(props: Props) {
  const route = await getter(props.params.routeId)!;

  return (
    <ShowLayout
      headerProps={{
        title: route.name,
        href: `/crags/${
          route.boulder!.area!.crag!.id
        }/explorer/area/${route.boulder!.area!.id!}/boulder/${
          route.boulder!.id
        }/route/${route.id}`,
      }}
      tabsProps={{
        basePath: `/routes/${route.id}`,
      }}
    >
      {props.children}
    </ShowLayout>
  );
}
