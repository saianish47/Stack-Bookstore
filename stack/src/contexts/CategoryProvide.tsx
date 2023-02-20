import { useEffect, useState } from "react";
import { CategoryContext } from "./CategoryContext";
import axios from "axios";
import React from "react";

interface CategoryProviderProps {
  children: React.ReactNode;
}

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
