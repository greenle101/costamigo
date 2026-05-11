export interface SeoMetaTags {
  title: string;
  metaDesc: string;
  canonical: string;
  opengraphTitle: string;
  opengraphDescription: string;
  opengraphImage: string | null;
  twitterTitle: string;
  twitterDescription: string;
}

export interface GetMetaTagsResponse {
  page: {
    title: string;
    seo: SeoMetaTags;
  };
}