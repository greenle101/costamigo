import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim() ||
  "https://dashboard.costamigo.vn/graphql";

/**
 * `GRAPHQL_RSC_FETCH_CACHE`: `no-store` | `force-cache` | `revalidate`
 * When `revalidate`, set `GRAPHQL_RSC_REVALIDATE_SECONDS` (default 60).
 * Unknown values fall back to `no-store`.
 */
function graphqlRscFetchOptions(): RequestInit {
  const mode = (
    process.env.GRAPHQL_RSC_FETCH_CACHE ?? "no-store"
  ).toLowerCase();

  if (mode === "revalidate") {
    const raw = process.env.GRAPHQL_RSC_REVALIDATE_SECONDS;
    const parsed =
      raw != null && raw !== "" ? Number.parseInt(raw, 10) : 60;
    const revalidate =
      Number.isFinite(parsed) && parsed >= 0 ? parsed : 60;
    return { next: { revalidate } } as RequestInit;
  }

  if (mode === "force-cache") {
    return { cache: "force-cache" };
  }

  if (mode === "no-store") {
    return { cache: "no-store" };
  }

  return { cache: "no-store" };
}

/** Sent only from this server bundle (never use `NEXT_PUBLIC_` for secrets). */
function graphqlRscServerHeaders(): Record<string, string> {
  const secret = process.env.GRAPHQL_SERVER_SECRET?.trim();
  if (!secret) return {};
  return { "X-GraphQL-Server-Secret": secret };
}

export const { getClient } = registerApolloClient(() => {
  console.log("[Apollo RSC]", !!process.env.GRAPHQL_RSC_FETCH_CACHE);
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      headers: graphqlRscServerHeaders(),
      fetchOptions: graphqlRscFetchOptions(),
    }),
  });
});
