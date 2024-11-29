import SearchLayout from "@/app/_components/search/SearchLayout";
import { searchParamsCache } from "@/app/_components/search/searchParams";
import getCrag from "@/app/api/_actions/getCrag";
import {
  asSearchResultType,
  default as search,
} from "@/app/api/_actions/search";
import { notFound } from "next/navigation";

export default async function page(
  props: {
    params: Promise<{ cragId: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const crag = await getCrag(params.cragId);
  if (!crag) notFound();

  const searchCache = searchParamsCache.parse(searchParams);

  const results = await search({
    cragId: crag.id!,
    search: searchCache.search,
    type: asSearchResultType(searchCache.type),
    shade: searchCache.shade,
    shadeHour: searchCache.shadeHour,
  });

  return <SearchLayout crag={crag} results={results} />;
}
