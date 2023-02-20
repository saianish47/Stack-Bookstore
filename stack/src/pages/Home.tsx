import React from "react";
import { Link } from "react-router-dom";
import HomeStaffList from "../components/HomeStaffList";
import { StaffContextProvider } from "../contexts/StaffProvider";

const Home = () => {
  console.log("Inside Home");
  return (
    <div className="home-page">
      <section className="left-body container">
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
      <section className="category-images container">
        <StaffContextProvider>
          <HomeStaffList />
        </StaffContextProvider>
      </section>
    </div>
  );
};

export default Home;
