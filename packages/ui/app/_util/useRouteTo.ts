import useSearchParamsPath from "@/app/_util/useSearchParamsPath";
import { usePathname, useRouter } from "next/navigation";
import { join } from "path";

interface Params {
  relative?: boolean;
  includeSearchParams?: boolean;
  replace?: boolean;
}

export default function useRouteTo({
  relative = true,
  includeSearchParams = false,
  replace = false,
}: Params = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const handleRelative = (path: string) => {
    return relative ? join(pathname, path) : path;
  };
  const handleSearchParams = useSearchParamsPath();

  return (path: string, newSearchParams?: URLSearchParams) => {
    (replace ? router.replace : router.push)(
      handleRelative(
        handleSearchParams(
          path,
          includeSearchParams ? newSearchParams : undefined
        )
      )
    );
  };
}
