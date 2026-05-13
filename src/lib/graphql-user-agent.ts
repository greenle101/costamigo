const DEFAULT_USER_AGENT = "Costamigo/0.1.0";

/**
 * User-Agent for GraphQL HTTP requests.
 * Server: optional `GRAPHQL_USER_AGENT`, then `NEXT_PUBLIC_GRAPHQL_USER_AGENT`.
 * Client: optional `NEXT_PUBLIC_GRAPHQL_USER_AGENT` only.
 * Browsers may ignore a script-set `User-Agent` header.
 */
export function graphqlUserAgent(): string {
  if (typeof window === "undefined") {
    const serverUa = process.env.GRAPHQL_USER_AGENT?.trim();
    if (serverUa) return serverUa;
  }
  const publicUa = process.env.NEXT_PUBLIC_GRAPHQL_USER_AGENT?.trim();
  if (publicUa) return publicUa;
  return DEFAULT_USER_AGENT;
}
