import React from "react";
import { BookItem } from "../models/types";
import { useAppDispatch } from "../hooks";
import { addToCart } from "../slice/CartSlice";

interface Props {
  book: BookItem;
}
function CategoryBookListItem({ book }: Props) {
  const dispatch = useAppDispatch();

  return (
    <li className="book-box">
      <div className="book-image">
        <img
          src={require(`../assets/images/books/${book.title}.jpg`)}
          alt={`${book.title}.jpg`}
        />
        {book.is_public ? (
          <button className="button preview">Preview</button>
        ) : (
          <></>
        )}
      </div>
      <div className="details">
        <ul className="book-info">
          <li className="book-title">{book.title}</li>
          <li className="book-author">by {book.author}</li>
          <li className="book-price">$ {(book.price / 100).toFixed(2)}</li>
        </ul>
        <button
          className="button add-to-cart"
          onClick={() => dispatch(addToCart(book))}
        >
          <i className="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </li>
  );
}

export default CategoryBookListItem;
