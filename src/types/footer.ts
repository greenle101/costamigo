export interface FooterInfo {
  facebook: string;
  view360: string;
  link: string;
}

export interface GetFooterInfoResponse {
  footerOptions: {
    footer: FooterInfo;
  };
}