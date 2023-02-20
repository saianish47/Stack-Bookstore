/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { CategoryItem } from "../models/types";

interface CategoryContext {
  category: CategoryItem[];
  selectedCategory: string;
  setSelectedCategory: (categoryName: string) => void;
}

const CategoryContext = React.createContext<CategoryContext>({
  category: [],
  selectedCategory: "Romance",
  setSelectedCategory: () => {},
});

export { CategoryContext };
