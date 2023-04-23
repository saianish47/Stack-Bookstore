import React from "react";
import { asDollarsAndCents } from "../models/types";
import { OrderDetails } from "../models/types";

interface OrderProps {
  orderDetails: OrderDetails;
}

function ConfirmationTable({ orderDetails }: OrderProps) {
  return (
    <table className="confirmation-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Book Price</th>
          <th>Sub-total</th>
        </tr>
      </thead>
      <tbody>
        {orderDetails.cart &&
          orderDetails.cart.map((item) => (
            <tr key={item.book.book_id}>
              <td>{item.book.title}</td>
              <td>{item.quantity}</td>
              <td>{asDollarsAndCents(item.book.price)}</td>
              <td className="cart-book-subtotal">
                {asDollarsAndCents(item.quantity * item.book.price)}
              </td>
            </tr>
          ))}
        <tr>
          <td colSpan={3} className="price-style">
            Surcharge
          </td>
          <td>{asDollarsAndCents(500)}</td>
        </tr>
        <tr>
          <td colSpan={3} className="price-style">
            Total
          </td>
          <td className="total">{orderDetails.order.amount}</td>
        </tr>
      </tbody>
    </table>
  );
}

export { ConfirmationTable };
