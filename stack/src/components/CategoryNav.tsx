import React from "react";
import { Link } from "react-router-dom";
import { CategoryItem } from "../models/types";

interface CategoryNavProps {
  categoryList: CategoryItem[];
  categoryName: string;
}

function CategoryNav({ categoryList, categoryName }: CategoryNavProps) {
  return (
    <nav className="category-nav">
      <ul className="category-buttons">
        {categoryList.map((category) => (
          <li key={category.category_id}>
            <Link
              to={"../category/" + category.name}
              className={
                category.name === categoryName
                  ? "button selected-category-button"
                  : "button unselected-category-button"
              }
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default CategoryNav;
