import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";

import { graphqlUserAgent } from "@/lib/graphql-user-agent";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim() ||
  "https://dashboard.costamigo.vn/graphql";

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

function taduwafBypassHeaders(): Record<string, string> {
  const name = process.env.TADU_WAF_BYPASS_HEADER?.trim();
  const value = process.env.TADU_WAF_BYPASS_SECRET?.trim();
  if (!name || !value) return {};
  return { [name]: value };
}

function graphqlRscServerHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": graphqlUserAgent(),
    ...taduwafBypassHeaders(),
  };
  const secret = process.env.GRAPHQL_SERVER_SECRET?.trim();
  if (secret) headers["X-GraphQL-Server-Secret"] = secret;
  return headers;
}

export const { getClient } = registerApolloClient(() => {
  const wafHeader = process.env.TADU_WAF_BYPASS_HEADER?.trim();
  const wafSecret = process.env.TADU_WAF_BYPASS_SECRET?.trim();
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      headers: graphqlRscServerHeaders(),
      fetchOptions: graphqlRscFetchOptions(),
    }),
  });
});
