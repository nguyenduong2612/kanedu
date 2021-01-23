export interface Post {
  author: string;
  author_id: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  created_at: number;
  sharedLink?: string;
}
