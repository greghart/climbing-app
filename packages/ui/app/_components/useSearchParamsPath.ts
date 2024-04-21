import { useSearchParams } from "next/navigation";

export default function useSearchParamsPath() {
  const searchParams = useSearchParams();
  return (path: string) => `${path}?${searchParams.toString()}`;
}
