import React from "react";
import CategoryNav from "../components/CategoryNav";
import { useParams } from "react-router-dom";
import CategoryBookList from "../components/CategoryBookList";
import { updateBooks } from "../slice/BookSlice";
import { setSelectedCategory } from "../slice/CategorySlice";
import { useAppDispatch, useAppSelector } from "../hooks";

function Category() {
  const dispatch = useAppDispatch();
  const { category } = useAppSelector((state) => state.category);

  const { categoryName = "" } = useParams();

  React.useEffect(() => {
    dispatch(setSelectedCategory(categoryName));
    const fetchBooks = async () => {
      try {
        await dispatch(updateBooks(categoryName));
      } catch (error) {
        console.error(`Failed to update books: ${error}`);
      }
    };
    categoryName !== "" && fetchBooks();
  }, [categoryName]);

  return (
    <div className="category-page">
      <CategoryNav categoryList={category} categoryName={categoryName} />
      <CategoryBookList />
    </div>
  );
}

export default Category;
