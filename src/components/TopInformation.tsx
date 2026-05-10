"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";

/** Matches `md` in tailwind.config.ts — grid is 2 cols below this, 4 cols from md up. */
const MD_MIN_WIDTH_PX = 768;
const ITEMS_PER_PAGE_TWO_COL = 6;
const ITEMS_PER_PAGE_FOUR_COL = 8;

const SLIDE_MS = 780;
const SWIPE_MIN_PX = 42;

/** Upper bound for tile strip (~4×171px + column gaps). Keeps the slide close to actual tile width so arrows stay visually near the grid on desktop. */
const MAX_SLIDE_PX = 800;

/**
 * `md+`: four equal columns inside the slide viewport so tiles shrink between ~768–920px instead of
 * clipping (fixed 171px×4 + arrows needs ~916px).
 */
const GRID_CLASS =
  "grid w-full max-md:mx-auto max-md:grid-cols-2 max-md:justify-items-center gap-x-[0.625rem] gap-y-4 max-xs:gap-x-1 max-xs:gap-y-[1.375rem] sm:gap-x-[28px] sm:gap-y-4 md:grid-cols-4 md:justify-center md:justify-items-center md:gap-x-[16px] md:gap-y-2 lg:flex-none lg:max-w-full lg:grid-cols-[repeat(4,171px)] min-[1101px]:gap-x-[75px]";

const CELL_SHELL_CLASS =
  "aspect-square w-full min-w-0 max-w-full max-sm:max-w-[118px] sm:max-md:max-w-[220px] max-md:justify-self-center max-lg:overflow-hidden max-lg:rounded-sm flex-col items-center justify-center px-1 pb-1 pt-5 xs:px-1.5 xs:pb-1.5 xs:pt-[1.625rem] sm:px-2 sm:pb-2 sm:pt-9 lg:aspect-auto lg:h-[168px] lg:max-h-none lg:max-w-none lg:w-[171px] lg:justify-center lg:overflow-hidden lg:rounded-none lg:px-[22.5px] lg:pb-[7.5px] lg:pt-[49.5px]";

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

function InformationPager({
  items,
  itemsPerPage,
  reduceMotion,
}: {
  items: InformationItem[];
  itemsPerPage: number;
  reduceMotion: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [slideWidth, setSlideWidth] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const swipeOriginRef = useRef<{ x: number; y: number } | null>(null);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const pages = useMemo(() => {
    const chunks: (InformationItem | null)[][] = [];
    for (let p = 0; p < totalPages; p++) {
      const slice = items.slice(p * itemsPerPage, p * itemsPerPage + itemsPerPage);
      const row: (InformationItem | null)[] = [...slice];
      while (row.length < itemsPerPage) row.push(null);
      chunks.push(row);
    }
    return chunks;
  }, [items, itemsPerPage, totalPages]);

  const measureSlideWidth = useCallback(() => {
    const wrap = containerRef.current;
    const inner = innerRef.current;
    const p = prevBtnRef.current;
    const n = nextBtnRef.current;
    if (!wrap || !inner || !p || !n) return;

    const gapStr = getComputedStyle(inner).columnGap || getComputedStyle(inner).gap;
    const gap = parseFloat(gapStr) || 12;
    const cw = wrap.getBoundingClientRect().width;
    const reserved =
      p.getBoundingClientRect().width + n.getBoundingClientRect().width + 2 * gap;
    const raw = Math.floor(cw - reserved);
    const capped = Math.min(Math.max(0, raw), MAX_SLIDE_PX);
    if (capped > 0) setSlideWidth(capped);
  }, []);

  /**
   * Strip width = space between arrows (from full-width container), capped so fixed lg tiles do not sit in a
   * huge empty flex slot (looked like arrows were “far” until scroll/resize refreshed layout). Also listen to
   * `visualViewport` / `resize` so scrollbar or chrome changes match layout immediately.
   */
  useLayoutEffect(() => {
    measureSlideWidth();
    const ro = new ResizeObserver(measureSlideWidth);
    const el = containerRef.current;
    if (el) ro.observe(el);

    window.addEventListener("resize", measureSlideWidth);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", measureSlideWidth);

    let rafId = 0;
    rafId = requestAnimationFrame(() => measureSlideWidth());

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", measureSlideWidth);
      vv?.removeEventListener("resize", measureSlideWidth);
    };
  }, [measureSlideWidth, itemsPerPage, items.length, totalPages]);

  const displayPage = Math.min(currentPage, Math.max(0, totalPages - 1));

  const canGoPrev = displayPage > 0;
  const canGoNext = displayPage < totalPages - 1;

  function goToPrevPage() {
    if (!canGoPrev) return;
    setCurrentPage((page) => {
      const clamped = Math.min(page, totalPages - 1);
      return Math.max(0, clamped - 1);
    });
  }

  function goToNextPage() {
    if (!canGoNext) return;
    setCurrentPage((page) => {
      const clamped = Math.min(page, totalPages - 1);
      return Math.min(totalPages - 1, clamped + 1);
    });
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swipeOriginRef.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLElement>) {
    const origin = swipeOriginRef.current;
    swipeOriginRef.current = null;
    if (!origin) return;
    const dx = e.clientX - origin.x;
    const dy = e.clientY - origin.y;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx > 0) goToPrevPage();
    else goToNextPage();
  }

  function renderPageSlots(slots: (InformationItem | null)[], pageIndex: number) {
    const baseStart = pageIndex * itemsPerPage;
    return slots.map((item, index) => {
      if (!item) {
        return (
          <div
            key={`p${pageIndex}-empty-${index}`}
            aria-hidden
            className={`relative flex ${CELL_SHELL_CLASS} pointer-events-none invisible`}
          />
        );
      }
      const absoluteIndex = baseStart + index + 1;
      return (
        <Link
          key={`p${pageIndex}-i${index}-${item.id}`}
          href={item.postLink?.url ?? "#"}
          title={item.title}
          className={`group relative flex bg-top bg-[length:100%_100%] bg-no-repeat text-center text-white transition hover:opacity-70 ${CELL_SHELL_CLASS}`}
          style={{ backgroundImage: "url('/img/top/slider_bg_01.svg')" }}
          target="_blank"
        >
          <div className="relative z-10 flex min-h-0 w-full min-w-0 flex-col items-center px-0 max-lg:flex-1 max-lg:justify-center lg:block">
            <p className="order-number font-serif shrink-0 text-sm leading-none tracking-tight xs:text-[10px] r:text-[10px] sm:text-[32px] lg:text-[45px] mb-0.5 xs:mb-1 sm:mb-2">
              {String(absoluteIndex).padStart(2, "0")}
            </p>
            <p className="short-desc mt-0 w-full min-w-0 max-lg:mt-0.5 pt-0.5 font-serif text-[9px] leading-snug xs:text-[10px] sm:text-[16px] lg:mt-0 lg:text-[16px] r:text-[10px] lg:leading-[1.4] line-clamp-2 break-words text-center">
              {item.title}
            </p>
          </div>
        </Link>
      );
    });
  }

  const transitionStyle: CSSProperties | undefined =
    reduceMotion || slideWidth == null
      ? undefined
      : { transition: `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` };

  return (
    <div ref={containerRef} className="w-full min-w-0 max-w-full px-1 xs:px-2">
      <div
        ref={innerRef}
        className="flex min-w-0 max-w-full items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2 lg:gap-2"
      >
      {pages.length > 0 && (
        <button
          ref={prevBtnRef}
          type="button"
          onClick={goToPrevPage}
          disabled={!canGoPrev}
          aria-label="Previous items"
          className="swiper-button-prev relative z-10 r:w-[30px] r:h-[30px] shrink-0 xs:h-12 xs:w-12 md:h-14 md:w-14"
        />
      )}

      <section
        ref={sectionRef}
        className="section-post-item min-h-0 max-w-full shrink-0 touch-pan-y overflow-hidden"
        style={
          slideWidth != null && slideWidth > 0
            ? ({ width: slideWidth, maxWidth: "100%" } as CSSProperties)
            : { maxWidth: "100%" }
        }
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          swipeOriginRef.current = null;
        }}
      >
        {slideWidth != null && slideWidth > 0 ? (
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex will-change-transform"
              style={{
                transform: `translateX(-${displayPage * slideWidth}px)`,
                ...transitionStyle,
              }}
            >
              {pages.map((slots, pageIndex) => (
                <div key={pageIndex} className="shrink-0 overflow-hidden" style={{ width: slideWidth }}>
                  <div className={GRID_CLASS}>{renderPageSlots(slots, pageIndex)}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="min-h-48 max-md:min-h-[12rem]" aria-hidden />
        )}
      </section>
      {pages.length > 0 && (
        <button
          ref={nextBtnRef}
          type="button"
          onClick={goToNextPage}
          disabled={!canGoNext}
          aria-label="Next items"
          className="swiper-button-next relative z-10 r:w-[30px] r:h-[30px] shrink-0 xs:h-12 xs:w-12 md:h-14 md:w-14"
        />
      )}
      </div>
    </div>
  );
}

export default function TopInformation({ items = [] }: TopInformationProps) {
  const [isMdUp, setIsMdUp] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MD_MIN_WIDTH_PX}px)`);
    const sync = () => setIsMdUp(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const itemsPerPage = isMdUp ? ITEMS_PER_PAGE_FOUR_COL : ITEMS_PER_PAGE_TWO_COL;

  return (
    <main className="my-5 top-posts slider-top-information w-full min-w-0 max-w-full overflow-x-hidden">
      <div className="space-y-3 md:space-y-5">
        <header className="text-center">
          <div className="top-images-logo mb-4 flex w-full min-w-0 max-w-full items-center justify-center gap-3 px-2 sm:gap-5 md:gap-8 md:px-0">
            <img
              src="/img/top/costamigo_logo_01.png"
              alt="Costamigo logo"
              className="contact-costamigo h-auto w-auto max-w-[min(48%,calc(100vw*294/768))] shrink object-contain md:max-w-none md:w-[294px] md:shrink-0 lg:w-[248px] xl:w-[230px]"
            />
            <img
              src="/img/top/erasland_logo_01.png"
              alt="Erasland logo"
              className="contact-erasland h-auto w-auto max-w-[min(44%,calc(100vw*214/768))] shrink object-contain md:max-w-none md:w-[214px] md:shrink-0 lg:w-[181px] xl:w-[160px]"
            />
          </div>
          <h1 className="title-top-page px-0.5 text-[clamp(0.8125rem,3.6vw,1rem)] font-thin tracking-wide xs:text-[20px] sm:r:text-[32px] md:r:text-[38px] lg:r:text-[35px]">
            CỔNG THÔNG TIN DỮ LIỆU DỰ ÁN
          </h1>
        </header>

        <div className="post-items-list w-full min-w-0 max-w-full">
          <InformationPager
            key={itemsPerPage}
            items={items}
            itemsPerPage={itemsPerPage}
            reduceMotion={reduceMotion}
          />
        </div>
        <footer className="mt-8 px-2 text-center">
          <a
            href="#"
            className="inline-block rounded-sm px-3 py-1.5 text-[clamp(0.75rem,3vw,0.9375rem)] font-semibold text-[#7a4f2f] transition-colors duration-200 hover:text-[#5a3520] xs:text-[clamp(0.8125rem,3.2vw,1rem)] sm:px-4 sm:py-2 sm:text-lg md:text-xl lg:r:text-[24px]"
          >
            www.costamigo.erasland.vn
          </a>
          <div className="logo-contact mb-1.5 flex items-center justify-center gap-2 xs:mb-2 xs:gap-3 sm:mb-3 sm:gap-4 md:mb-4 md:gap-5">
            <a
              href="#"
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
              href="#"
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
      </div>
    </main>
  );
}
