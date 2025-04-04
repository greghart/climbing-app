import GoBackHeader from "@/app/_components/layouts/GoBackHeader";
import PageLayout from "@/app/_components/layouts/PageLayout";
import OpenTopoLink from "@/app/_components/photos/OpenTopoLink";
import PhotoableLink from "@/app/_components/photos/PhotoableLink";
import PhotoImageListItem from "@/app/_components/photos/PhotoImageListItem";
import UpdatePhotoForm from "@/app/_components/photos/UpdatePhotoForm";
import ShowContentCard from "@/app/_components/show/ShowContentCard";
import finderByID from "@/app/_util/finderByID";
import getPhoto from "@/app/api/_actions/getPhoto";
import updatePhoto from "@/app/api/_actions/updatePhoto";

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
        <ShowContentCard>
          <PhotoableLink photoable={photo.photoable} />
          <OpenTopoLink photo={photo} />
          <UpdatePhotoForm photo={photo} action={updatePhoto} />
          <PhotoImageListItem photo={photo} hideTitle />
        </ShowContentCard>
      }
    />
  );
}
