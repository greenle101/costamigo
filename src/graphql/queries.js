import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query Posts {
    posts(
      first: 100
      where: {
        orderby: { field: MENU_ORDER, order: ASC }
      }
    ) {
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
        link
        linkText
      }
    }
  }
`;