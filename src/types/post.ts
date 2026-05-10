export interface Post {
  id: string;
  title: string;
  slug: string;
  postLink: {
    url?: string;
  };
}

export interface GetPostsResponse {
  posts: {
    nodes: Post[];
  };
}
