import React from "react";
import { asDollarsAndCents, BookItem } from "../models/types";
import { CartContext } from "../contexts/CartProvider";
import { Link } from "react-router-dom";
import { CategoryContext } from "../contexts/CategoryProvider";

function CartTable() {
  const { count, cart, clearCart, updateBookQuantity } =
    React.useContext(CartContext);
  const updateCart = function (book: BookItem, quantity: number) {
    updateBookQuantity(book, quantity);
  };
  const clear = () => {
    clearCart();
  };
  // React.useEffect(() => {
  //   clearCart();
  // }, [cart]);
  const { selectedCategory } = React.useContext(CategoryContext);
  return (
    <div>
      <div className="cartNav">
        <div className="cartDetails">
          {count === 0 ? (
            <h1>Your Cart is Empty</h1>
          ) : count === 1 ? (
            <p>Your cart : {count} book</p>
          ) : (
            <p>Your cart : {count} books</p>
          )}
        </div>
        {!cart.empty ? (
          <p onClick={clear} className="t-button">
            clear cart
          </p>
        ) : (
          <></>
        )}
      </div>
      <div className="cart-table">
        {!cart.empty ? (
          <ul>
            <li className="table-heading">
              <div className="heading-book">Book</div>
              <div className="heading-price">Price / Quantity</div>
              <div className="heading-subtotal">Amount</div>
            </li>
            {cart.items.map((item) => (
              <li key={item.book.book_id}>
                <div className="cart-book-image">
                  <img
                    src={require(`../assets/images/books/${item.book.title}.jpg`)}
                    alt={`${item.book.title}.jpg`}
                  />
                </div>
                <div className="cart-book-title">{item.book.title}</div>
                <div className="cart-book-price">
                  {asDollarsAndCents(item.book.price)}
                </div>
                <div className="cart-book-quantity">
                  <span
                    className="dec-button"
                    onClick={() => updateCart(item.book, item.quantity - 1)}
                  >
                    <i className="fa-solid fa-circle-minus"></i>
                  </span>
                  <span className="quantity">{item.quantity}</span>
                  <span
                    className="inc-button"
                    onClick={() => updateCart(item.book, item.quantity + 1)}
                  >
                    <i className="fa-solid fa-circle-plus"></i>
                  </span>
                </div>
                <div className="cart-book-subtotal">
                  {asDollarsAndCents(item.quantity * item.book.price)}
                </div>
                <div className="line-sep"></div>
              </li>
            ))}
            <li>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div className="cart-book-total">
                Total : {asDollarsAndCents(cart.subtotal)}
              </div>
            </li>
          </ul>
        ) : (
          <></>
        )}
      </div>
      <div className="lower-button">
        <Link to={`/category/${selectedCategory}`} className="sec-button sec">
          Back to Shopping
        </Link>
        {cart.numberOfItems !== 0 ? (
          <Link to="/checkout" className="button CTA">
            Proceed to Checkout
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export { CartTable };
