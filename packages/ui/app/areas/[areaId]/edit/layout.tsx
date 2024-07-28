import ShowLayout from "@/app/_components/show/ShowLayout";
import getArea from "@/app/api/_actions/getArea";
import { notFound } from "next/navigation";

export interface Props {
  children: React.ReactNode;
  params: {
    areaId: string;
  };
}

export default async function Layout(props: Props) {
  const area = await getArea(props.params.areaId);
  if (!area) notFound();

  return (
    <ShowLayout
      headerProps={{
        title: area.name,
        href: `/areas/${area.id}/explorer`,
      }}
      tabsProps={{
        basePath: `/areas/${area.id}`,
      }}
    >
      {props.children}
    </ShowLayout>
  );
}
