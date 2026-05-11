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


export const GET_META_TAGS = gql`
  query MetaTags {
    page(id: "/", idType: URI) {
      title
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
        twitterTitle
        twitterDescription
      }
    }
  }
`;

export const GET_FOOTER_INFO = gql`
  query FooterInfo {
    footerOptions {
      footer {
        facebook
        view360
      }
    }
  }
`;