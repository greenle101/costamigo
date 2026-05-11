export interface FooterInfo {
  facebook: string;
  view360: string;
}

export interface GetFooterInfoResponse {
  footerOptions: {
    footer: FooterInfo;
  };
}