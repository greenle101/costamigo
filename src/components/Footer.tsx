"use client";

import { GetFooterInfoResponse } from "@/types/footer";

interface FooterProps {
  footerInfo: GetFooterInfoResponse;
}

export default function Footer({ footerInfo }: FooterProps) {
  return (
    <footer className="mt-4 px-2 text-center">
          <a
            href="https://www.costamigo.erasland.vn/"
            className="inline-block rounded-sm px-3 py-1.5 text-[clamp(0.75rem,3vw,0.9375rem)] font-semibold text-[#7a4f2f] transition-colors duration-200 hover:text-[#5a3520] xs:text-[clamp(0.8125rem,3.2vw,1rem)] sm:px-4 sm:py-2 sm:text-lg md:text-xl lg:r:text-[24px]" target="_blank" rel="noopener noreferrer"
          >
            www.costamigo.erasland.vn
          </a>
          <div className="logo-contact mb-1.5 flex items-center justify-center gap-2 xs:mb-2 xs:gap-3 sm:mb-3 sm:gap-4 md:mb-4 md:gap-5">
            <a
              href={footerInfo.footerOptions.footer.facebook || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-block transition-opacity duration-200 hover:opacity-70"
            >
              <img
                src="/img/top/facebook_icn_01.svg"
                alt="Facebook"
                className="h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:r:h-[48px] lg:r:w-[48px]"
              />
            </a>
            <a
              href={footerInfo.footerOptions.footer.view360 ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cube"
              className="inline-block transition-opacity duration-200 hover:opacity-70"
            >
              <img
                src="/img/top/cube_icn_01.svg"
                alt="Cube"
                className="h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:r:h-[48px] lg:r:w-[48px]"
              />
            </a>
          </div>
        </footer>
  );
}