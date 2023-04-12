import { getAuth, signOut } from "firebase/auth";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartProvider";

export const Profile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { clearCart } = useContext(CartContext);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const closeDropdown = () => setShowDropdown(false);

  const handleLogout = () => {
    signOut(getAuth());
    clearCart("CLEAR");
  };

  return (
    <div
      className="dropdown"
      onMouseEnter={toggleDropdown}
      onMouseLeave={closeDropdown}
    >
      <button className="button profile-button " type="button">
        <i className="icon fa-solid fa-user"></i> Profile
      </button>
      <ul className={`dropdown-menu custom ${showDropdown ? "show" : ""}`}>
        <li>
          <Link className="dropdown-item" to={"/account"}>
            Account
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to={"/my-orders"}>
            Orders
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <Link to={"/"} className="dropdown-item" onClick={handleLogout}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};
