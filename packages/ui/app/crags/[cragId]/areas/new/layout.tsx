import ShowLayout from "@/app/_components/show/ShowLayout";
import getCrag from "@/app/api/_actions/getCrag";
import { notFound } from "next/navigation";

export interface Props {
  children: React.ReactNode;
  params: Promise<{
    cragId: string;
  }>;
}

export default async function Layout(props: Props) {
  const crag = await getCrag((await props.params).cragId);
  if (!crag) notFound();

  return (
    <ShowLayout
      headerProps={{
        title: crag.name,
        href: `/crags/${crag.id}/explorer`,
      }}
      tabsProps={{
        basePath: `/crags/${crag.id}`,
      }}
    >
      {props.children}
    </ShowLayout>
  );
}
