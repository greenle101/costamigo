import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";

import { graphqlUserAgent } from "@/lib/graphql-user-agent";

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

/**
 * Tadu WAF (or similar): bypass by header instead of IP allowlist.
 * Set both `TADU_WAF_BYPASS_HEADER` and `TADU_WAF_BYPASS_SECRET` (server-only,
 * never `NEXT_PUBLIC_`). If either is missing, no bypass header is sent.
 * Browser Apollo cannot safely send this; use RSC or a Route Handler proxy.
 */
function taduwafBypassHeaders(): Record<string, string> {
  const name = process.env.TADU_WAF_BYPASS_HEADER?.trim();
  const value = process.env.TADU_WAF_BYPASS_SECRET?.trim();
  if (!name || !value) return {};
  return { [name]: value };
}

/** Sent only from this server bundle (never use `NEXT_PUBLIC_` for secrets). */
function graphqlRscServerHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": graphqlUserAgent(),
    ...taduwafBypassHeaders(),
  };
  const secret = process.env.GRAPHQL_SERVER_SECRET?.trim();
  if (secret) headers["X-GraphQL-Server-Secret"] = secret;
  console.log("[Apollo RSC] Headers", headers);
  return headers;
}

export const { getClient } = registerApolloClient(() => {
  const wafHeader = process.env.TADU_WAF_BYPASS_HEADER?.trim();
  const wafSecret = process.env.TADU_WAF_BYPASS_SECRET?.trim();
  console.log("[Apollo RSC]", !!process.env.GRAPHQL_RSC_FETCH_CACHE);
  console.log("[Apollo RSC] Tadu WAF bypass", {
    active: Boolean(wafHeader && wafSecret),
    header: wafHeader ?? null,
    secretSet: Boolean(wafSecret),
  });
  if (process.env.DEBUG_LOG_TADU_WAF_SECRET === "1") {
    console.log("[Apollo RSC] TADU_WAF_BYPASS_SECRET (debug)", wafSecret);
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      headers: graphqlRscServerHeaders(),
      fetchOptions: graphqlRscFetchOptions(),
    }),
  });
});
