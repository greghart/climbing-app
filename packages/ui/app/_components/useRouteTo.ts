import { usePathname, useRouter } from "next/navigation";
import useSearchParamsPath from "@/app/_components/useSearchParamsPath";

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
    return relative ? `${pathname}/${path}` : path;
  };
  const handleSearchParams = includeSearchParams
    ? useSearchParamsPath()
    : (path: string) => path;

  return (path: string) => {
    (replace ? router.replace : router.push)(
      handleRelative(handleSearchParams(path))
    );
  };
}
