import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { GET_META_TAGS } from "@/graphql/queries";
import { getClient } from "@/lib/apollo-rsc";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { GetMetaTagsResponse } from "@/types/meta";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Injected @font-face so Vietnamese glyphs render in Playfair, not generic serif fallback. */
const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-playfair-display",
});

const fallbackTitle = "Costamigo";
const fallbackDescription = "Costamigo";

const fallbackMetadata: Metadata = {
  title: fallbackTitle,
  description: fallbackDescription,
};

function cleanMetaValue(value: string | null | undefined) {
  return value?.trim() || undefined;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await getClient().query<GetMetaTagsResponse>({
      query: GET_META_TAGS,
    });

    const page = data?.page;
    const seo = page?.seo;

    const title = cleanMetaValue(seo?.title) ?? page?.title ?? fallbackTitle;
    const description =
      cleanMetaValue(seo?.metaDesc) ??
      cleanMetaValue(seo?.opengraphDescription) ??
      fallbackDescription;
    const canonical = cleanMetaValue(seo?.canonical);
    const image = cleanMetaValue(seo?.opengraphImage);

    return {
      title,
      description,
      alternates: canonical ? { canonical } : undefined,
      openGraph: {
        title: cleanMetaValue(seo?.opengraphTitle) ?? title,
        description,
        url: canonical,
        images: image ? [image] : undefined,
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title: cleanMetaValue(seo?.twitterTitle) ?? title,
        description: cleanMetaValue(seo?.twitterDescription) ?? description,
        images: image ? [image] : undefined,
      },
    };
  } catch (error) {
    console.error("[RootLayout] GET_META_TAGS failed:", error);
    return fallbackMetadata;
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-100`}
    >
      <body className="d-flex flex-column min-vh-100 overflow-x-hidden antialiased">
        <ApolloWrapper>
          <div className="d-flex flex-column flex-grow-1 min-vh-100 w-100">{children}</div>
        </ApolloWrapper>
      </body>
    </html>
  );
}
