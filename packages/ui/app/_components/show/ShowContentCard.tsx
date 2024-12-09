import { Card, CardContent } from "@mui/material";

function ShowContentCard({ children }: { children: React.ReactNode }) {
  return (
    <Card
      sx={{
        borderRadius: {
          // square up if this becomes full width
          xs: 0,
        },
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
}
export default ShowContentCard;
