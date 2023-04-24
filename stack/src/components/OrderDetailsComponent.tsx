import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { my_orderDate } from "../models/types";
import { ConfirmationTable } from "./ConfirmationTable";
import { useAppSelector } from "../hooks";
import { getOrder } from "../slice/OrdersSlice";

export const OrderDetailsComponent = () => {
  const { id } = useParams();
  const orderId = id?.toString() ?? "";
  const orderDetails = useAppSelector(getOrder(orderId));
  console.log(orderDetails);
  console.log(sessionStorage.getItem("orders"));
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="confirmation-area">
        {orderDetails ? (
          <>
            <h2 className="conf-header">Order Details</h2>
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
                **** **** **** {orderDetails.customer.ccNumber.trim().slice(-4)}
              </li>
            </ul>
            <ConfirmationTable orderDetails={orderDetails} />
          </>
        ) : (
          <p>Order Details Not Found</p>
        )}
        <button className="sec-button button mt-3 mb-3" onClick={goBack}>
          {" "}
          Go Back
        </button>
      </div>
    </>
  );
};
