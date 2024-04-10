import getCrag from "@/app/api/_operations/getCrag";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const crag = await getCrag(params.id);
  return Response.json(crag);
}
