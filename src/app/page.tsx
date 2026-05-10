import { getClient } from "@/lib/apollo-rsc";
import { GET_POSTS } from "@/graphql/queries";
import { GetPostsResponse, Post } from "@/types/post";
import TopInformation from "@/components/TopInformation";
import { InformationItem } from "@/components/TopInformation";

const FALLBACK_ITEMS: InformationItem[] = [
  { id: "fallback-1", title: "Hồ sơ pháp lý", slug: "no", postLink: {url: "#"} },
  { id: "fallback-2", title: "Logo & Brand Guideline", slug: "no", postLink: {url: "#"} },
  { id: "fallback-3", title: "Factsheet & Mẫu hợp đồng", slug: "no", postLink: {url: "#"} },
  { id: "fallback-4", title: "Chính sách bán hàng", slug: "no", postLink: {url: "#"} },
  { id: "fallback-5", title: "Hồ sơ pháp lý", slug: "no", postLink: {url: "#"} },
  { id: "fallback-6", title: "Logo & Brand Guideline", slug: "no", postLink: {url: "#"} },
  { id: "fallback-7", title: "Factsheet & Mẫu hợp đồng", slug: "no", postLink: {url: "#"} },
  { id: "fallback-8", title: "Chính sách bán hàng", slug: "no", postLink: {url: "#"} },
  { id: "fallback-1", title: "Hồ sơ pháp lý", slug: "no", postLink: {url: "#"} },
  { id: "fallback-2", title: "Logo & Brand Guideline", slug: "no", postLink: {url: "#"} },
  { id: "fallback-3", title: "Factsheet & Mẫu hợp đồng", slug: "no", postLink: {url: "#"} },
  { id: "fallback-4", title: "Chính sách bán hàng", slug: "no", postLink: {url: "#"} },
  { id: "fallback-5", title: "Hồ sơ pháp lý", slug: "no", postLink: {url: "#"} },
  { id: "fallback-6", title: "Logo & Brand Guideline", slug: "no", postLink: {url: "#"} },
  { id: "fallback-7", title: "Factsheet & Mẫu hợp đồng", slug: "no", postLink: {url: "#"} },
  { id: "fallback-8", title: "Chính sách bán hàng", slug: "no", postLink: {url: "#"} },
];

export default async function Homepage() {
  try {
    const { data } = await getClient().query<GetPostsResponse>({
      query: GET_POSTS,
    });

    const posts = data?.posts?.nodes ?? [];
    console.log(posts);
    const items: InformationItem[] = posts.map((post: Post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      postLink: { url: post.postLink?.url ?? "#" },

    }));

    return renderHomeData(items.length ? items : FALLBACK_ITEMS);
  } catch (error) {
    // Surface the real reason in server logs instead of silently falling back.
    console.error("[Homepage] GET_POSTS failed:", error);
    return renderHomeData(FALLBACK_ITEMS);
  }
}

function renderHomeData(items: InformationItem[]) {
  return (
    <div
      className="relative flex min-h-screen w-full min-w-0 flex-col items-center justify-center overflow-x-hidden bg-[#ebe6df] bg-cover bg-center bg-no-repeat px-3 sm:px-4 md:px-6"
      style={{ backgroundImage: "url('/img/top/information_bg_01.jpg')" }}
    >
      <TopInformation items={items} />
    </div>
  );
}
