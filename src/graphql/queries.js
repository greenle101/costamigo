import { gql } from "@apollo/client";

// WPGraphQL exposes `posts` as a Relay-style connection (`RootQueryToPostConnection`).
// Fields live under `nodes` (or `edges.node`), not directly on `posts`.
export const GET_POSTS = gql`
  query Posts {
    posts {
      nodes {
        id
        title
        slug
        postLink {
          url
        }
      }
    }
  }
`;
