"use client";
import { Card, CardHeader, CardMedia, Slide } from "@mui/material";
import { IPhoto } from "models";
import { useSearchParams } from "next/navigation";

function PhotoCard(props: { photo: IPhoto }) {
  "use client";
  const params = useSearchParams();
  const card = (
    <Card>
      <CardHeader
        title={props.photo.title}
        subheader={props.photo.description}
      />
      <CardMedia
        component="img"
        height={200}
        image={`/uploads/photos/${props.photo.upload!.key}`}
        alt={props.photo.title}
      />
    </Card>
  );
  if (params.get("highlight") === props.photo.id!.toString()) {
    return (
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        {card}
      </Slide>
    );
  }
  return card;
}
export default PhotoCard;
