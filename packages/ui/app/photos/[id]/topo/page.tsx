import GoBackHeader from "@/app/_components/layouts/GoBackHeader";
import PageLayout from "@/app/_components/layouts/PageLayout";
import PhotoableLink from "@/app/_components/photos/PhotoableLink";
import TopoEditor from "@/app/_components/photos/topos/TopoEditor";
import TopoEditorStoreProvider from "@/app/_components/photos/topos/TopoEditorStoreProvider";
import finderByID from "@/app/_util/finderByID";
import getTopo from "@/app/api/_actions/getTopo";

export interface Props {
  params: Promise<{
    id: string;
  }>;
}

const getter = finderByID(getTopo);

export default async function Page(props: Props) {
  const { photo, entities } = await getter((await props.params).id);

  return (
    <PageLayout
      header={<GoBackHeader disabled value={photo.title} />}
      content={
        <>
          <PhotoableLink photoable={photo.photoable} />
          <TopoEditorStoreProvider photo={photo} entityPool={entities}>
            <TopoEditor photo={photo} />
          </TopoEditorStoreProvider>
        </>
      }
    />
  );
}
