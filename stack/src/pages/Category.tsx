import React from "react";
import CategoryNav from "../components/CategoryNav";
import { useParams } from "react-router-dom";
import CategoryBookList from "../components/CategoryBookList";
import BooksProvider from "../contexts/BookProvider";
import { CategoryContext } from "../contexts/CategoryContext";

function Category() {
  const { category, setSelectedCategory } = React.useContext(CategoryContext);

  const { categoryName = "" } = useParams();

  React.useEffect(() => {
    setSelectedCategory(categoryName);
  }, [categoryName]);
  return (
    <div className="category-page">
      <CategoryNav categoryList={category} categoryName={categoryName} />
      <BooksProvider categoryName={categoryName}>
        <CategoryBookList />
      </BooksProvider>
    </div>
  );
}

export default Category;
