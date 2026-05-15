export interface FooterInfo {
  facebook: string;
  view360: string;
  link: string;
  linkText: string;
}

export interface GetFooterInfoResponse {
  footerOptions: {
    footer: FooterInfo;
  };
}