import { getClient } from "@/lib/apollo-rsc";
import { GET_FOOTER_INFO, GET_POSTS } from "@/graphql/queries";
import { GetPostsResponse, Post } from "@/types/post";
import { GetFooterInfoResponse } from "@/types/footer";
import TopInformation from "@/components/TopInformation";
import { InformationItem } from "@/components/TopInformation";
import Footer from "@/components/Footer";

const FALLBACK_ITEMS: InformationItem[] = [
  { id: "fallback-1", title: "Hồ sơ pháp lý", slug: "no", postLink: { url: "#" } },
  { id: "fallback-2", title: "Logo & Brand Guideline", slug: "no", postLink: { url: "#" } },
  { id: "fallback-3", title: "Factsheet & Mẫu hợp đồng", slug: "no", postLink: { url: "#" } },
  { id: "fallback-4", title: "Chính sách bán hàng", slug: "no", postLink: { url: "#" } },
  { id: "fallback-5", title: "Hồ sơ pháp lý", slug: "no", postLink: { url: "#" } },
  { id: "fallback-6", title: "Logo & Brand Guideline", slug: "no", postLink: { url: "#" } },
  { id: "fallback-7", title: "Factsheet & Mẫu hợp đồng", slug: "no", postLink: { url: "#" } },
  { id: "fallback-8", title: "Chính sách bán hàng", slug: "no", postLink: { url: "#" } },
  { id: "fallback-1", title: "Hồ sơ pháp lý", slug: "no", postLink: { url: "#" } },
  { id: "fallback-2", title: "Logo & Brand Guideline", slug: "no", postLink: { url: "#" } },
  { id: "fallback-3", title: "Factsheet & Mẫu hợp đồng", slug: "no", postLink: { url: "#" } },
  { id: "fallback-4", title: "Chính sách bán hàng", slug: "no", postLink: { url: "#" } },
  { id: "fallback-5", title: "Hồ sơ pháp lý", slug: "no", postLink: { url: "#" } },
  { id: "fallback-6", title: "Logo & Brand Guideline", slug: "no", postLink: { url: "#" } },
  { id: "fallback-7", title: "Factsheet & Mẫu hợp đồng", slug: "no", postLink: { url: "#" } },
  { id: "fallback-8", title: "Chính sách bán hàng", slug: "no", postLink: { url: "#" } },
];

const fallbackFooterInfo: GetFooterInfoResponse = {
  footerOptions: {
    footer: { facebook: "", view360: "", link: "" },
  },
};

export default async function Homepage() {
  const [postsResult, footerResult] = await Promise.allSettled([
    getClient().query<GetPostsResponse>({ query: GET_POSTS }),
    getClient().query<GetFooterInfoResponse>({ query: GET_FOOTER_INFO }),
  ]);

  let footerInfo: GetFooterInfoResponse = fallbackFooterInfo;
  if (footerResult.status === "fulfilled" && footerResult.value.data) {
    console.log("[Homepage] GET_FOOTER_INFO data:", footerResult.value.data);
    footerInfo = footerResult.value.data;
  } else if (footerResult.status === "rejected") {
    console.error("[Homepage] GET_FOOTER_INFO failed:", footerResult.reason);
  }

  let items: InformationItem[] = FALLBACK_ITEMS;
  if (postsResult.status === "fulfilled") {
    const data = postsResult.value.data;
    console.log("[Homepage] GET_POSTS data:", data);
    const posts = data?.posts?.nodes ?? [];
    const mapped: InformationItem[] = posts.map((post: Post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      postLink: { url: post.postLink?.url ?? "#" },
    }));
    if (mapped.length) items = mapped;
  } else {
    console.error("[Homepage] GET_POSTS failed:", postsResult.reason);
  }

  return renderHomeData(items, footerInfo);
}

function renderHomeData(items: InformationItem[], footerInfo: GetFooterInfoResponse) {
  return (
    <main className="w-100 d-flex flex-column flex-grow-1" id="home-page">
      <section className="section-top-information section-common costamigo-page d-flex flex-column flex-grow-1">
        <div className="wrapper w-100 mx-auto wrapper-inner-padding">
          <TopInformation items={items} />
          <Footer footerInfo={footerInfo} />
        </div>
      </section>
    </main>
  );
}
