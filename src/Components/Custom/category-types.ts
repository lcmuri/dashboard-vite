export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: "active" | "inactive";
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  level: number;
  children: Category[];
}

export interface CategoryTreeProps {
  categories: Category[];
  className?: string;
  onCategorySelect?: (category: Category) => void;
}
