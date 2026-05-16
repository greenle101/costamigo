const DEFAULT_USER_AGENT = "Costamigo/0.1.0";

export function graphqlUserAgent(): string {
  if (typeof window === "undefined") {
    const serverUa = process.env.GRAPHQL_USER_AGENT?.trim();
    if (serverUa) return serverUa;
  }
  const publicUa = process.env.NEXT_PUBLIC_GRAPHQL_USER_AGENT?.trim();
  if (publicUa) return publicUa;
  return DEFAULT_USER_AGENT;
}
