import { Card, CardContent } from "@mui/material";

function ShowContentCard({
  children,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      sx={{
        borderRadius: {
          // square up if this becomes full width
          xs: 0,
        },
      }}
      {...props}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
}
export default ShowContentCard;
