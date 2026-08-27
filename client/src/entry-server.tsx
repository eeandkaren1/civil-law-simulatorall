import { renderToString } from "react-dom/server";
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { Router } from "wouter";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import App from "./App";
import { trpc } from "./lib/trpc";

export type SsrRenderResult = { html: string; dehydratedState: unknown };

export function render(url: string): SsrRenderResult {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } });
  const trpcClient = trpc.createClient({ links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })] });
  const queryIndex = url.indexOf("?");
  const ssrPath = queryIndex === -1 ? url : url.slice(0, queryIndex);
  const ssrSearch = queryIndex === -1 ? "" : url.slice(queryIndex + 1);
  const html = renderToString(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router ssrPath={ssrPath} ssrSearch={ssrSearch}>
          <App />
        </Router>
      </QueryClientProvider>
    </trpc.Provider>,
  );
  return { html, dehydratedState: dehydrate(queryClient) };
}
