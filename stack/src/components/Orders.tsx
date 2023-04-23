import React from "react";
import { my_orderDate, OrderDetails } from "../models/types";
import NotFound from "../pages/NotFound";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getAllOrders } from "../slice/OrdersSlice";

function Orders() {
  const myOrders = useAppSelector((state) => state.orders.allOrders);
  const { latestOrderDetails } = useAppSelector((state) => state.orders);

  const user = useAppSelector((state) => state.userDetails.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleViewDetails = (order: OrderDetails) => {
    navigate(`${order.order.orderId}`);
  };

  React.useEffect(() => {
    dispatch(getAllOrders());
  }, [user, latestOrderDetails]);
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
