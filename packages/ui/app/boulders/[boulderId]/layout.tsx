import ShowLayout from "@/app/_components/show/ShowLayout";
import finderByID from "@/app/_util/finderByID";
import getBoulder from "@/app/api/_actions/getBoulder";

export interface Props {
  children: React.ReactNode;
  params: Promise<{
    boulderId: string;
  }>;
}

const getter = finderByID(getBoulder);

export default async function Layout(props: Props) {
  const boulder = await getter((await props.params).boulderId)!;

  return (
    <ShowLayout
      headerProps={{
        title: boulder.name,
        href: `/crags/${boulder.area!.crag!.id}/explorer/area/${boulder.area!
          .id!}/boulder/${boulder.id}`,
      }}
      tabsProps={{
        basePath: `/boulders/${boulder.id}`,
      }}
    >
      {props.children}
    </ShowLayout>
  );
}
