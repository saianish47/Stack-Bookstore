import React, { useContext } from "react";
import { BooksContext } from "../contexts/BooksContext";
import CategoryBookListItem from "./CategoryBookListItem";
import { CartProvider } from "../contexts/CartProvider";

function CategoryBookList() {
  const { books } = useContext(BooksContext);

  return (
    <ul className="bookList">
      {books.map((book) => (
        <div key={book.book_id}>
          <CartProvider>
            <CategoryBookListItem book={book} />
          </CartProvider>
        </div>
      ))}
    </ul>
  );
}

export default CategoryBookList;
