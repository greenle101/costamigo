"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const MD_MIN_WIDTH_PX = 768;
const ITEMS_PER_PAGE_TWO_COL = 6;
const ITEMS_PER_PAGE_FOUR_COL = 8;

export interface InformationItem {
  id: string;
  title: string;
  slug: string;
  postLink: {
    url: string;
  };
}

interface TopInformationProps {
  items?: InformationItem[];
}

function remSpaceBetweenPx(): number {
  if (typeof document === "undefined") return 12;
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const mobile = window.matchMedia("(max-width: 767.98px)").matches;
  return rem * (mobile ? 0.35 : 0.75);
}

export default function TopInformation({ items = [] }: TopInformationProps) {
  const uid = useId().replace(/:/g, "");
  const rootId = `information-slider-${uid}`;

  const [mounted, setMounted] = useState(false);
  /** SSR / first paint: assume desktop chunks so 4×2 grid matches reference [costamigo.leaddigital.vn/html](https://costamigo.leaddigital.vn/html/). */
  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.matchMedia(`(min-width: ${MD_MIN_WIDTH_PX}px)`).matches,
  );
  const [spacePx, setSpacePx] = useState(12);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MD_MIN_WIDTH_PX}px)`);
    const sync = () => setIsMdUp(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const update = () => setSpacePx(remSpaceBetweenPx());
    update();
    window.addEventListener("resize", update);
    const mq = window.matchMedia("(max-width: 767.98px)");
    mq.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
    };
  }, []);

  const itemsPerPage = isMdUp ? ITEMS_PER_PAGE_FOUR_COL : ITEMS_PER_PAGE_TWO_COL;

  const pages = useMemo(() => {
    if (!items.length) return [];
    const chunks: InformationItem[][] = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      chunks.push(items.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, [items, itemsPerPage]);

  const sliderBlockClass = `slider-top-information ${
    isMdUp ? "slider-information-pc" : "slider-information-sp"
  }`;

  return (
    <>
      <div className="information-contact">
        <div className="contact-wrapper">
          <figure className="contact-costamigo mb-0">
            <img
              className="image-common img-fluid"
              src="/img/top/costamigo_logo_01.png"
              width={294}
              height={126}
              alt="COSTAMIGO"
              loading="eager"
            />
          </figure>
          <figure className="contact-erasland mb-0">
            <img
              className="image-common img-fluid"
              src="/img/top/erasland_logo_01.png"
              width={214}
              height={43}
              alt="ERASLAND"
              loading="eager"
            />
          </figure>
        </div>
      </div>

      <div className="information-heading">
        <h1 className="title-common-primary">
          <span className="title-label">CỔNG THÔNG TIN DỮ LIỆU DỰ ÁN </span>
        </h1>
      </div>

      <div id={rootId} className={sliderBlockClass}>
        {!mounted || pages.length === 0 ? (
          <div className="swiper js-slider-information" style={{ minHeight: "3rem" }} aria-hidden />
        ) : (
          <Swiper
            className="swiper js-slider-information"
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={spacePx}
            loop={false}
            navigation={{
              nextEl: `#${rootId} .swiper-button-next`,
              prevEl: `#${rootId} .swiper-button-prev`,
            }}
            onSwiper={(swiper) => {
              requestAnimationFrame(() => swiper.navigation?.update());
            }}
          >
            {pages.map((pageItems, pageIndex) => (
              <SwiperSlide key={pageIndex}>
                <div className="slide-grid">
                  {pageItems.map((item, idx) => {
                    const n = pageIndex * itemsPerPage + idx + 1;
                    return (
                      <Link
                        key={item.id}
                        href={item.postLink?.url ?? "#"}
                        className="slide-item trans text-decoration-none"
                        title={item.title}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="slide-number">{String(n).padStart(2, "0")}</span>
                        <span className="slide-text">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <button
          type="button"
          className="swiper-button-next trans"
          aria-label="Next slide"
        />
        <button
          type="button"
          className="swiper-button-prev trans"
          aria-label="Previous slide"
        />
      </div>
    </>
  );
}
