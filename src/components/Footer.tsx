"use client";

import { GetFooterInfoResponse } from "@/types/footer";

interface FooterProps {
  footerInfo: GetFooterInfoResponse;
}

export default function Footer({ footerInfo }: FooterProps) {
  return (
    <footer className="information-social text-center">
      <a
        href="https://www.costamigo.erasland.vn/"
        className="social-link trans"
        target="_blank"
        rel="noopener noreferrer"
      >
        www.costamigo.erasland.vn
      </a>
      <div className="social-list">
        <a
          href={footerInfo.footerOptions.footer.facebook || "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="social-item trans opacity-hover"
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
          href={footerInfo.footerOptions.footer.view360 ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Cube"
          className="social-item trans opacity-hover"
        >
          <img
            src="/img/top/cube_icn_01.svg"
            alt="Cube"
            width={48}
            height={48}
            className="object-common"
          />
        </a>
      </div>
    </footer>
  );
}
