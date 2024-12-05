import GoBackHeader from "@/app/_components/layouts/GoBackHeader";
import PageLayout from "@/app/_components/layouts/PageLayout";
import PhotoCard from "@/app/_components/photos/PhotoCard";
import ShowContentCard from "@/app/_components/show/ShowContentCard";
import finderByID from "@/app/_util/finderByID";
import getPhoto from "@/app/api/_actions/getPhoto";

export interface Props {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

const getter = finderByID(getPhoto);

export default async function Layout(props: Props) {
  const photo = await getter((await props.params).id)!;

  return (
    <PageLayout
      header={<GoBackHeader disabled value={photo.title} />}
      content={
        <ShowContentCard>
          <PhotoCard photo={photo} />
        </ShowContentCard>
      }
    />
  );
}
