/* eslint-disable @typescript-eslint/no-empty-function */
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

interface CategoryProviderProps {
  children: React.ReactNode;
}

import { CategoryItem } from "../models/types";

interface CategoryContext {
  category: CategoryItem[];
  selectedCategory: string;
  setSelectedCategory: (categoryName: string) => void;
}

export const CategoryContext = React.createContext<CategoryContext>({
  category: [],
  selectedCategory: "Romance",
  setSelectedCategory: () => {},
});

function CategoryProvider({ children }: CategoryProviderProps) {
  const [category, setCategory] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Romance");
  const getCategory = async () => {
    try {
      const category = await axios
        .get("/api/categories/")
        .then((Response) => Response.data);
      setCategory(category);
    } catch (error) {
      console.error(`an error occured inside the Category Provide ${error}`);
    }
  };
  useEffect(() => {
    if (!hasMounted) {
      getCategory();
      setHasMounted(true);
    }
  }, [hasMounted]);
  return (
    <CategoryContext.Provider
      value={{ category, selectedCategory, setSelectedCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export default CategoryProvider;
