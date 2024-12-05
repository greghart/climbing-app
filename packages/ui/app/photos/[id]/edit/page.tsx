import GoBackHeader from "@/app/_components/layouts/GoBackHeader";
import PageLayout from "@/app/_components/layouts/PageLayout";
import PhotoImageListItem from "@/app/_components/photos/PhotoImageListItem";
import UpdatePhotoForm from "@/app/_components/photos/UpdatePhotoForm";
import ShowContentCard from "@/app/_components/show/ShowContentCard";
import finderByID from "@/app/_util/finderByID";
import getPhoto from "@/app/api/_actions/getPhoto";
import updatePhoto from "@/app/api/_actions/updatePhoto";
import { Link, Typography } from "@mui/material";
import NextLink from "next/link";

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
          <Typography variant="subtitle2">{photo.description}</Typography>
          <Typography variant="caption">
            {photo.photoable?.crag && (
              <>
                For crag<> </>
                <NextLink
                  href={`/crags/${photo.photoable.crag.id}/photos`}
                  passHref
                  legacyBehavior
                >
                  <Link underline="hover" color="inherit">
                    {photo.photoable?.crag?.name}
                  </Link>
                </NextLink>
              </>
            )}
          </Typography>
          <UpdatePhotoForm photo={photo} action={updatePhoto} />
          <PhotoImageListItem photo={photo} hideTitle />
        </ShowContentCard>
      }
    />
  );
}
