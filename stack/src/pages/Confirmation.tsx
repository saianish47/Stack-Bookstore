import React from "react";
import { CategoryContext } from "../contexts/CategoryContext";
import { OrderContext } from "../contexts/OrderProvider";
// import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ConfirmationTable } from "../components/ConfirmationTable";

const Confirmation = () => {
  const { selectedCategory } = React.useContext(CategoryContext);
  const { orderDetails, hasOrderDetails } = React.useContext(OrderContext);

  //   const orderDate = useMemo(() => {
  //     const date = new Date(orderDetails.order.dateCreated);
  //     return date.toLocaleTimeString();
  //   }, [orderDetails.order.dateCreated]);
  const orderDate = () => {
    const date = new Date(orderDetails.order.dateCreated);
    return date.toLocaleTimeString();
  };
  //   const ccExpDate = (): Date => {
  //     return new Date(orderDetails.customer.cc);
  //   };

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
  console.log(flag);

  return (
    <div className="confirmation-area">
      {!flag ? (
        <div>
          <p>Sorry we cannot find your order details</p>
          <section className="bottom-button"></section>
          <section className="sec-button bottom-button">
            <Link to="/">Go to home Page</Link>
          </section>
        </div>
      ) : (
        <>
          <h2 className="conf-header">Confirmation Details</h2>
          <ul>
            <li>
              Confirmation #: <b>{orderDetails.order.confirmationNumber}</b>
            </li>
            <li>Time: {orderDate()}</li>
          </ul>
          <ul className="customerInfo">
            <h3>Customer Information</h3>
            <li>{orderDetails.customer.name}</li>
            <li>{orderDetails.customer.address}</li>
            <li>{orderDetails.customer.email}</li>
            <li>{orderDetails.customer.phone}</li>
            <li>
              **** **** **** {ccNumber()} ({ccExpMonth()}-{ccExpYear()})
            </li>
          </ul>
          <ConfirmationTable />
          <section className="bottom-button">
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
