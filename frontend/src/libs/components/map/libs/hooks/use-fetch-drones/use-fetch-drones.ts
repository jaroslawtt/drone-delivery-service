import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { type MapGetAllItemReponseDto } from "~/packages/map/map";

const MAP_QUERY_KEY = ["mapQueryKey"];

const useFetchDrones = () => {
  const { data } = useQuery<MapGetAllItemReponseDto[]>({
    queryFn: () => Promise.resolve([]),
    queryKey: MAP_QUERY_KEY,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env["NEXT_PUBLIC_API_ORIGIN_URL"] as string}/map`,
    );

    eventSource.onopen = () => {
      console.log("SSE connection opened.");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        queryClient.setQueriesData({ queryKey: MAP_QUERY_KEY }, data);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);

  return {
    data: useMemo(() => data ?? ([] as MapGetAllItemReponseDto[]), [data]),
  };
};

export { useFetchDrones };
