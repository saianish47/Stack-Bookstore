import React from "react";
import { MyOrderContext } from "../contexts/MyOrderProvider";
import { my_orderDate, OrderDetails } from "../models/types";
import useUser from "../hooks/useUser";
import NotFound from "../pages/NotFound";
import { Link, useNavigate } from "react-router-dom";

function Orders() {
  const { myOrders } = React.useContext(MyOrderContext);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleViewDetails = (order: OrderDetails) => {
    navigate(`${order.order.orderId}`);
  };
  console.log(myOrders);

  return (
    <div className="order-area">
      {user ? (
        <>
          {myOrders.length ? (
            <>
              <h2 className="conf-header">Your Orders</h2>
              <table className="confirmation-table">
                <thead>
                  <tr>
                    <th>Confirmation Number</th>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  {myOrders.map((orders, i) => (
                    <tr key={i}>
                      <td
                        onClick={() => handleViewDetails(orders)}
                        className="click-order"
                      >
                        {orders.order.confirmationNumber}
                      </td>
                      <td>{orders.order.orderId}</td>
                      <td>{orders.order.amount}</td>
                      <td>{my_orderDate(orders.order.dateCreated)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>Sorry we cannot find any orders</p>
          )}
          <section className="sec-button bottom-button mt-3 mb-3">
            <Link to="/">Go to home Page</Link>
          </section>
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );
}

export { Orders };
