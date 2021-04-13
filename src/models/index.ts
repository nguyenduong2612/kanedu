export interface Course {
  id: string;
  author: string;
  author_id: string;
  name: string;
  level: string;
  skill: string;
  category: string;
  description: string;
  created_at: number;
  followed_by: Array<string>;
}

export interface Lesson {
  id: string;
  numberOfCards: number;
  title: string;
  created_at: number;
}

export interface Card {
  id: string;
  keyword: string;
  meaning: string;
  detail: string;
  other: string;
  status?: string;
}

export interface Post {
  id: string;
  avatar: string;
  author: string;
  author_id: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  created_at: number;
  sharedLink?: string;
  isFavorited: boolean;
}

export interface Question {
  id: string;
  question: string;
  answer: Array<string>;
  part: string;
}
