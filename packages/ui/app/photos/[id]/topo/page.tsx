import GoBackHeader from "@/app/_components/layouts/GoBackHeader";
import PageLayout from "@/app/_components/layouts/PageLayout";
import PhotoableLink from "@/app/_components/photos/PhotoableLink";
import TopoEditor from "@/app/_components/photos/topos/TopoEditor";
import TopoEditorStoreProvider from "@/app/_components/photos/topos/TopoEditorStoreProvider";
import finderByID from "@/app/_util/finderByID";
import getPhoto from "@/app/api/_actions/getPhoto";

export interface Props {
  params: Promise<{
    id: string;
  }>;
}

const getter = finderByID(getPhoto);

export default async function Page(props: Props) {
  const photo = await getter((await props.params).id);

  return (
    <PageLayout
      header={<GoBackHeader disabled value={photo.title} />}
      content={
        <>
          <PhotoableLink photoable={photo.photoable} />
          <TopoEditorStoreProvider photo={photo}>
            <TopoEditor photo={photo} />
          </TopoEditorStoreProvider>
        </>
      }
    />
  );
}
