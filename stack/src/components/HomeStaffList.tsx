import React from "react";
import { StaffContext } from "../contexts/StaffProvider";

const HomeStaffList = () => {
  const { staffList } = React.useContext(StaffContext);
  console.log("Rendering HomeStaffList component");
  return (
    <div>
      <h1 className="staff-picks">Staff Picks of the month</h1>
      <section className="home-images">
        <ul>
          {staffList.map((item) => (
            <li key={item.book_id}>
              <img
                src={require(`../assets/images/books/${item.title}.jpg`)}
                alt={`${item.title}.jpg`}
              />
              <div className="book-title">{item.title}</div>
              <div className="book-author">by {item.author}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HomeStaffList;
