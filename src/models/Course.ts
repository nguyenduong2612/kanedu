export interface Course {
  id: string,
  author: string;
  author_id: string;
  name: string;
  description: string;
  created_at: number;
  followed_by: Array<string>;
}
