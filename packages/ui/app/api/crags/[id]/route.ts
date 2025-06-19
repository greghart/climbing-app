import getCrag from "@/app/api/_actions/getCrag";

// TODO This is unused, but left as a reference if we want a JSON API
export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const crag = await getCrag(params.id);
  return Response.json(crag);
}
