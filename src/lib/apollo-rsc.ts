import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim() ||
  "https://costamigo.leaddigital.vn/graphql";

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

export const { getClient } = registerApolloClient(
  () =>
    new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: GRAPHQL_ENDPOINT,
        fetchOptions: graphqlRscFetchOptions(),
      }),
    })
);
