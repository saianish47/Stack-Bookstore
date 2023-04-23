import { Link } from "react-router-dom";
import { CategoryItem } from "../models/types";
import React from "react";

interface Props {
  categoryList: CategoryItem[];
}

const HeaderDropdown = ({ categoryList }: Props) => {
  return (
    <div className="header-dropdown">
      <button className="button categories-button">Categories</button>
      <ul>
        {categoryList &&
          categoryList.map((category) => (
            <Link key={category.category_id} to={`/category/${category.name} `}>
              <li>{category.name}</li>
            </Link>
          ))}
      </ul>
    </div>
  );
};

export default HeaderDropdown;
