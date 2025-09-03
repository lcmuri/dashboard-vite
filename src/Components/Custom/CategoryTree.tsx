import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // Using react-router-dom for Link
import { Collapse } from "reactstrap";

// Define the MenuItem interface directly within this file for self-containment.
// This interface describes the structure of each item expected in the category tree.
export interface MenuItem {
  id: number;
  label: string;
  link: string;
  icon?: string; // Optional icon class for display (e.g., "ri-dashboard-line")
  isHeader?: boolean; // Indicates if the item is a header (not directly used for rendering in this component)
  subItems?: MenuItem[]; // Array of child menu items for nesting
  click?: (event: React.MouseEvent) => void; // Optional click handler
  stateVariables?: boolean; // Controls the open/close state of the reactstrap Collapse component
  badgeName?: string; // Text for an optional badge
  badgeColor?: string; // Color for an optional badge
  slug?: string; // Slug for generating unique keys or links
}

// Define the props interface for the CategoryTree component.
interface CategoryTreeProps {
  items: MenuItem[]; // The array of MenuItem objects to render
  handleMenuItemClick: (itemId: number) => void; // Function to call when a menu item is clicked to toggle its state
}

/**
 * CategoryTree component renders a hierarchical list of categories.
 * It uses reactstrap's Collapse component for expandable sub-menus.
 */
const CategoryTree: React.FC<CategoryTreeProps> = ({
  items,
  handleMenuItemClick,
}) => {
  /**
   * Recursive function to render individual menu items and their children.
   * @param menuItems - An array of MenuItem objects to render.
   * @returns React Fragments containing the rendered list items.
   */
  const renderItems = (menuItems: MenuItem[]) => {
    return (menuItems || []).map((item: MenuItem) => (
      <React.Fragment key={item.id}>
        {/* Check if the current item has sub-items, indicating it's a collapsible parent */}
        {item.subItems && item.subItems.length > 0 ? (
          <li className="nav-item">
            {/* Link for a parent item that toggles a dropdown */}
            <Link
              onClick={(e) => {
                e.preventDefault(); // Prevent default navigation for dropdown toggles
                handleMenuItemClick(item.id); // Call the handler to toggle collapse state
              }}
              className="nav-link menu-link d-flex align-items-center" // Added d-flex and align-items-center for layout
              to={item.link ? item.link : "/#"} // Use item's link or a fallback
              data-bs-toggle="collapse" // Bootstrap attribute for collapse behavior
              aria-expanded={item.stateVariables ? "true" : "false"} // ARIA attribute for accessibility
            >
              {/* Render category-specific icon if present */}
              {item.icon && <i className={item.icon}></i>}{" "}
              <span
                className="flex-grow-1"
                data-key={`t-${item.slug || item.id}`}
              >
                {item.label}
              </span>{" "}
              {/* Display item label, flex-grow-1 to push badge/icon to end */}
              {/* Show number of children categories in a badge */}
              {item.subItems && item.subItems.length > 0 && (
                <span
                  className={`badge badge-pill bg-info ms-2`} // Using bg-info for a blue badge, ms-2 for margin-left
                  data-key="t-child-count"
                >
                  {item.subItems.length}
                </span>
              )}
              {/* Collapse indicator icon (e.g., chevron) - always present for collapsible items */}
              <i
                className={`ri-arrow-right-s-line ms-auto transition-transform duration-300 ${
                  item.stateVariables ? "rotate-90" : ""
                }`}
              ></i>
            </Link>
            {/* Collapse component to show/hide sub-items */}
            <Collapse
              className="menu-dropdown"
              isOpen={item.stateVariables} // Controls collapse state based on MenuItem's stateVariables
              id={`sidebar-${item.id}`} // Unique ID for each collapse instance
            >
              <ul className="nav nav-sm flex-column">
                {/* Recursively call renderItems to render sub-items */}
                {renderItems(item.subItems)}
              </ul>
            </Collapse>
          </li>
        ) : (
          // Render a simple link if the item has no sub-items
          <li className="nav-item">
            <Link
              className="nav-link menu-link"
              to={item.link ? item.link : "/#"} // Link to the category page
            >
              {/* Icon is not rendered for non-collapsible items as per request */}
              <span>{item.label}</span> {/* Display item label */}
              {/* No badge for non-collapsible items */}
            </Link>
          </li>
        )}
      </React.Fragment>
    ));
  };

  return (
    // The main unordered list for the navigation menu
    <ul className="navbar-nav" id="navbar-nav">
      {renderItems(items)} {/* Start rendering the top-level menu items */}
    </ul>
  );
};

// Define PropTypes for type checking to ensure correct prop usage.
CategoryTree.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string,
      icon: PropTypes.string,
      subItems: PropTypes.array, // Can be an array of MenuItem objects
      stateVariables: PropTypes.bool,
      badgeName: PropTypes.string, // Still here, but logic uses subItems.length
      badgeColor: PropTypes.string, // Still here, but logic uses 'bg-info'
      slug: PropTypes.string, // Slug is now included in PropTypes
    })
  ).isRequired,
  handleMenuItemClick: PropTypes.func.isRequired,
};

export default CategoryTree;
