// queryClient.js

import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // Disable automatic refetching on window focus
      cacheTime: 1000 * 60 * 5, // Cache data for 5 minutes
    },
    mutations: {
      onError: (error) => {
        console.error("Mutation Error:", error);
      },
    },
  },
});

export default queryClient;
