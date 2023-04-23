import React from "react";
import CategoryBookListItem from "./CategoryBookListItem";
import { useAppSelector } from "../hooks";

function CategoryBookList() {
  const { books } = useAppSelector((state) => state.books);

  return (
    <ul className="bookList">
      {books &&
        books.map((book) => (
          <div key={book.book_id}>
            <CategoryBookListItem book={book} />
          </div>
        ))}
    </ul>
  );
}

export default CategoryBookList;
