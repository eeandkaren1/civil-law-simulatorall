import { createRoot, hydrateRoot } from "react-dom/client";
import { HydrationBoundary, QueryClient, QueryClientProvider, type DehydratedState } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { Router } from "wouter";
import superjson from "superjson";
import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from "@shared/const";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

declare global {
  interface Window { __RQ_STATE__?: unknown }
}

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } });
const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError) || typeof window === "undefined" || error.message !== UNAUTHED_ERR_MSG) return;
  window.location.href = getLoginUrl();
};
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") redirectToLoginIfUnauthorized(event.query.state.error);
});
queryClient.getMutationCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") redirectToLoginIfUnauthorized(event.mutation.state.error);
});
const trpcClient = trpc.createClient({ links: [httpBatchLink({ url: "/api/trpc", transformer: superjson, fetch: (input, init) => globalThis.fetch(input, { ...(init ?? {}), credentials: "include" }) })] });
const rawState = window.__RQ_STATE__;
const dehydratedState = (rawState ? superjson.deserialize(rawState as Parameters<typeof superjson.deserialize>[0]) : undefined) as DehydratedState | undefined;

const rootElement = document.getElementById("root")!;
const app = <trpc.Provider client={trpcClient} queryClient={queryClient}><QueryClientProvider client={queryClient}><HydrationBoundary state={dehydratedState}><Router><App /></Router></HydrationBoundary></QueryClientProvider></trpc.Provider>;
if (rootElement.firstChild) hydrateRoot(rootElement, app);
else createRoot(rootElement).render(app);
