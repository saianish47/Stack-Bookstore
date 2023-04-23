import React from "react";
import { Link } from "react-router-dom";
import HomeStaffList from "../components/HomeStaffList";

const Home = () => {
  return (
    <div className="home-page">
      <section className="left-body my-container">
        <h1 className="welcome-text">
          <span className="stack-me">Stack</span> up your room with our wide
          collection of books...
          <br />
          <br />
        </h1>
        <Link to="/category/Romance" className="button CTA">
          SHOP BOOKS!!!
        </Link>
      </section>
      <section className="category-images my-container">
        <HomeStaffList />
      </section>
    </div>
  );
};

export default Home;
