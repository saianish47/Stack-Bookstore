import { Link, useNavigate } from "react-router-dom";
import HeaderDropdown from "./HeaderDropdown";
import useUser from "../hooks/useUser";
import React from "react";
import { CategoryContext } from "../contexts/CategoryProvider";
import { CartContext } from "../contexts/CartProvider";
import { Profile } from "./Profile";

function Header() {
  const { category } = React.useContext(CategoryContext);
  const { count } = React.useContext(CartContext);
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="header my-container">
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
            <span className="badge"> {count} </span>
          </section>
        </Link>
        {user ? (
          <Profile />
        ) : (
          <section className="profile">
            <button
              className="button profile-button"
              onClick={() => {
                navigate("./login");
              }}
            >
              <i className="icon fa-solid fa-user"></i> Login
            </button>
          </section>
        )}
      </section>
    </div>
  );
}

export default Header;
