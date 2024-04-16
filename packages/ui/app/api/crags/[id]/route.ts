import getCrag from "@/app/api/_operations/getCrag";

// TODO This is unused, but left as a reference if we want a JSON API
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const crag = await getCrag(params.id);
  return Response.json(crag);
}
