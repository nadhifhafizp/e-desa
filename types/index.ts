export interface PageContent {
  section_key: string;
  title: string;
  content: string;
  image_url: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  published_at: string;
}

export interface Statistic {
  category: string;
  label: string;
  value: number;
}