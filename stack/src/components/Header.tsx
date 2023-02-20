import { Link } from "react-router-dom";
import HeaderDropdown from "./HeaderDropdown";
import React from "react";
import { CategoryContext } from "../contexts/CategoryContext";
import { CartContext } from "../contexts/CartProvider";

function Header() {
  const { category } = React.useContext(CategoryContext);
  const { cart } = React.useContext(CartContext);

  return (
    <div className="header container">
      <section className="bookstore-logo">
        <Link to="/">
          <img
            src={require("../assets/images/site/bookstore_logo.png")}
            alt="Another Bookstore Logo"
            className="logo"
          />
        </Link>
        <Link to="/" className="text-logo">
          <h1 className="text-logo">Stack</h1>
        </Link>
      </section>
      <section className="search-bar">
        <form action="../category/Romance">
          <i className="icon fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            className="input-text"
            placeholder=" Search for books..."
          />
        </form>
      </section>
      <section className="header-section">
        <HeaderDropdown categoryList={category} />
        <Link to="/cart">
          <section className="my-cart">
            <i className="cart fa-solid fa-cart-shopping"></i>
            <span className="badge"> {cart.numberOfItems} </span>
          </section>
        </Link>
        <section className="profile">
          <button className="button profile-button">
            <i className="icon fa-solid fa-user"></i> SAC
          </button>
        </section>
        <section className="logout">
          <p className="log" title="Logout">
            Logout
          </p>
        </section>
      </section>
    </div>
  );
}

export default Header;
