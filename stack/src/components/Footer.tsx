import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="upper-footer">
        <Link to="/">About Us</Link> |<Link to="/">Terms</Link> |
        <Link to="/">Privacy Policy</Link> |<Link to="/">Directions</Link> |
        <Link to="/">Help</Link>
      </div>
      <div className="middle-footer">
        <i className="fab fa-facebook"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-twitter"></i>
        <i className="fab fa-pinterest"></i>
      </div>
      <div className="lower-footer">
        <p className="lower">
          <i className="far fa-copyright"></i> 2022 Stack Bookstore
        </p>
      </div>
    </div>
  );
};
export default Footer;
