// src/utils/categoryTreeConverter.ts

export interface Category {
  name: string;
  slug: string;
  description: string | null;
  status: string;
  id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  level: number;
  children?: Category[]; // Add children for nesting, though not used in flat input
}

export interface MenuItem {
  id: number;
  label: string;
  link: string;
  icon?: string; // Optional icon for top-level categories
  isHeader?: boolean;
  subItems?: MenuItem[];
  click?: (event: React.MouseEvent) => void; // For toggling collapse
  stateVariables?: boolean; // To control collapse state
  badgeName?: string;
  badgeColor?: string;
  slug?: string; // Added slug property
}

/**
 * Converts a flat list of categories into a nested tree structure
 * suitable for the CategoryTree component.
 *
 * @param categories - The flat array of category objects from the API.
 * @returns An array of MenuItem objects representing the nested category tree.
 */
export const buildCategoryTree = (categories: Category[]): MenuItem[] => {
  const categoryMap: { [key: number]: MenuItem } = {};
  const rootCategories: MenuItem[] = [];

  // Initialize all categories as menu items and store them in a map
  categories.forEach((category) => {
    categoryMap[category.id] = {
      id: category.id,
      label: category.name,
      slug: category.slug, // Include slug
      link: `/categories/${category.slug}`, // Customize your link structure
      icon: category.level === 1 ? "ri-dashboard-line" : undefined, // Example icon for level 1
      subItems: [],
      stateVariables: false, // Initial state for collapse, will be managed by component
    };
  });

  // Build the tree structure
  categories.forEach((category) => {
    const menuItem = categoryMap[category.id];
    if (category.parent_id === null) {
      // Top-level category
      rootCategories.push(menuItem);
    } else {
      // Child category
      const parent = categoryMap[category.parent_id];
      if (parent) {
        // Ensure subItems array exists
        if (!parent.subItems) {
          parent.subItems = [];
        }
        parent.subItems.push(menuItem);
      }
    }
  });

  // Sort children by name for consistent display
  const sortChildren = (items: MenuItem[]) => {
    items.sort((a, b) => a.label.localeCompare(b.label));
    items.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        sortChildren(item.subItems);
      }
    });
  };

  sortChildren(rootCategories);

  return rootCategories;
};
