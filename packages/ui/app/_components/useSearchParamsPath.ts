import { useSearchParams } from "next/navigation";

export default function useSearchParamsPath() {
  const currentSearchParams = useSearchParams();
  return (path: string, newSearchParams?: URLSearchParams) => {
    const params = newSearchParams || currentSearchParams;
    if (params.size === 0) {
      return path;
    }
    return `${path}?${(newSearchParams || currentSearchParams).toString()}`;
  };
}
