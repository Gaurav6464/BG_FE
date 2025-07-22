// hooks/useWidgets.ts
import { useQuery } from "@tanstack/react-query";
import widGetService from "../api/widget";




export const useWidgets = () => {
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["widget"],
    queryFn: widGetService.get,
    placeholderData: (prev) => prev,
  });

  return {
    widgetData: data,
    isLoading,
    error,
    refetch,
  };
};
