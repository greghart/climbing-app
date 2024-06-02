import ShowLayout from "@/app/_components/show/ShowLayout";
import getCrag from "@/app/api/_operations/getCrag";
import { notFound } from "next/navigation";

export interface Props {
  children: React.ReactNode;
  params: {
    cragId: string;
  };
}

export default async function Layout(props: Props) {
  const crag = await getCrag(props.params.cragId);
  if (!crag) notFound();

  return (
    <ShowLayout
      headerProps={{
        title: crag.name,
        linkTo: `/crags/${crag.id}/explorer`,
      }}
      tabsProps={{
        basePath: `/crags/${crag.id}`,
      }}
    >
      {props.children}
    </ShowLayout>
  );
}