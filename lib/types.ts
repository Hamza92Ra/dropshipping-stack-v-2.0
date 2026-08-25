export type Tool = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  logo_url: string | null;
  website_url: string;
  affiliate_url: string;
  pricing: string | null;
  rating: number | null;
  upvotes: number;
  created_at: string;
};

export type Bookmark = {
  id: number;
  user_id: number;
  tool_id: number;
  created_at: string;
};

export type PriceAlert = {
  id: number;
  user_id: number;
  tool_id: number;
  target_price: number;
  active: boolean;
};

export type RoadmapItem = {
  id: number;
  user_id: number;
  title: string;
  done: boolean;
  position: number;
};
