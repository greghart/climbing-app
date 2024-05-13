import SearchLayout from "@/app/_components/search/SearchLayout";
import getCrag from "@/app/api/_operations/getCrag";
import { default as search } from "@/app/api/_operations/search";
import { notFound } from "next/navigation";

export default async function page({
  params,
  searchParams,
}: {
  params: { cragId: string };
  searchParams?: {
    query?: string;
  };
}) {
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  const results = await search({
    cragId: crag.id!,
    query: searchParams?.query,
  });

  return <SearchLayout crag={crag} results={results} />;
}
