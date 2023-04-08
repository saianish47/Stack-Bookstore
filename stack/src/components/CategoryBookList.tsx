import React, { useContext } from "react";
import { BooksContext } from "../contexts/BookProvider";
import CategoryBookListItem from "./CategoryBookListItem";

function CategoryBookList() {
  const { books } = useContext(BooksContext);

  return (
    <ul className="bookList">
      {books.map((book) => (
        <div key={book.book_id}>
          <CategoryBookListItem book={book} />
        </div>
      ))}
    </ul>
  );
}

export default CategoryBookList;
