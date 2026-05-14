"use client";

import { GetFooterInfoResponse } from "@/types/footer";

interface FooterProps {
  footerInfo: GetFooterInfoResponse;
}

const DEFAULT_SOCIAL_SITE = "https://costamigo.vn/";
const DEFAULT_SOCIAL_LABEL = "www.costamigo.vn";
const DEFAULT_FACEBOOK = "https://www.facebook.com/Costamigo.eras";
const DEFAULT_VIEW360 = "https://costamigo.vn/360.html";

export default function Footer({ footerInfo }: FooterProps) {
  const { facebook, view360, link } = footerInfo.footerOptions.footer;
  const siteHref = (link && link.trim()) || DEFAULT_SOCIAL_SITE;
  const siteLabel = DEFAULT_SOCIAL_LABEL;

  return (
    <footer className="information-social text-center">
      <a href={siteHref} className="social-link trans" target="_blank" rel="noopener noreferrer">
        {siteLabel}
      </a>
      <div className="social-list">
        <a
          href={facebook || DEFAULT_FACEBOOK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          title="Facebook"
          className="social-item trans"
        >
          <img
            src="/img/top/facebook_icn_01.svg"
            alt="Facebook"
            width={48}
            height={48}
            className="object-common"
          />
        </a>
        <a
          href={view360 || DEFAULT_VIEW360}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          title="Instagram"
          className="social-item trans"
        >
          <img
            src="/img/top/cube_icn_01.svg"
            alt="Instagram"
            width={48}
            height={48}
            className="object-common"
          />
        </a>
      </div>
    </footer>
  );
}
