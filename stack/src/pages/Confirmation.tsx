import React from "react";
import { CategoryContext } from "../contexts/CategoryProvider";
import { OrderContext } from "../contexts/OrderProvider";
import { Link } from "react-router-dom";
import { ConfirmationTable } from "../components/ConfirmationTable";
import { my_orderDate } from "../models/types";

const Confirmation = () => {
  const { selectedCategory } = React.useContext(CategoryContext);
  const { orderDetails, hasOrderDetails, orderError } =
    React.useContext(OrderContext);

  const ccNumber = (): string => {
    return orderDetails.customer.ccNumber.trim().slice(-4);
  };

  const ccExpYear = (): number => {
    return orderDetails.customer.ccExpiryYear;
  };

  const ccExpMonth = (): string => {
    const month = orderDetails.customer.ccExpiryMonth + 1;
    let result = "" + month;
    if (month < 10) {
      result = "0" + month;
    }
    return result;
  };
  const flag = hasOrderDetails();

  return (
    <div className="confirmation-area">
      {!flag ? (
        <>
          {orderError ? (
            <>
              <p> Payment Error </p>
              <section className="bottom-button"></section>
              <section className="sec-button bottom-button">
                <Link to="/cart">Go to Cart</Link>
              </section>
            </>
          ) : (
            <div>
              <p>Sorry we cannot find your order details</p>
              <section className="bottom-button"></section>
              <section className="sec-button bottom-button">
                <Link to="/">Go to home Page</Link>
              </section>
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="conf-header">Confirmation Details</h2>
          <ul>
            <li>
              Confirmation #: <b>{orderDetails.order.confirmationNumber}</b>
            </li>
            <li>Date: {my_orderDate(orderDetails.order.dateCreated)}</li>
          </ul>
          <ul className="customerInfo mb-3">
            <h3>Customer Information</h3>
            <li>{orderDetails.customer.name}</li>
            <li>{orderDetails.customer.address}</li>
            <li>{orderDetails.customer.email}</li>
            <li>{orderDetails.customer.phone}</li>
            <li>
              **** **** **** {ccNumber()} ({ccExpMonth()}-{ccExpYear()})
            </li>
          </ul>
          <ConfirmationTable orderDetails={orderDetails} />
          <section className="bottom-button mt-3 mb-3">
            <Link
              to={`/category/${selectedCategory}`}
              className="sec-button sec"
            >
              Continue Shopping
            </Link>
          </section>
        </>
      )}
    </div>
  );
};

export { Confirmation };
