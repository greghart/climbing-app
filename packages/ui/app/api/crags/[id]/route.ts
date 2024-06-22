import getArea from "@/app/api/_actions/getCrag";

// TODO This is unused, but left as a reference if we want a JSON API
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const crag = await getArea(params.id);
  return Response.json(crag);
}
