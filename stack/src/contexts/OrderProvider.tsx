/* eslint-disable @typescript-eslint/no-empty-function */

import React from "react";
import { OrderDetails } from "../models/types";

interface OrderProviderProps {
  children: React.ReactNode;
}

interface OrderContextValue {
  orderDetails: OrderDetails;
  clearOrderDetails: () => void;
  setOrderDetails: (order: OrderDetails) => void;
  hasOrderDetails: () => boolean;
}

export const OrderContext = React.createContext<OrderContextValue>({
  orderDetails: {} as OrderDetails,
  clearOrderDetails: () => {},
  setOrderDetails: () => {},
  hasOrderDetails: () => false,
});

const ORDER_DETAIL_STORAGE_KEY = "orderDetail";

// let temporderDetails: OrderDetails = {} as OrderDetails;
// const initOrderString: string | null = sessionStorage.getItem(
//   ORDER_DETAIL_STORAGE_KEY
// );

// if (initOrderString) {
//   const orderFromStorage = JSON.parse(initOrderString) as OrderDetails;
//   temporderDetails = Object.assign({}, orderFromStorage);
// }

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const temporderDetails: OrderDetails = {
    order: {
      orderId: "",
      amount: 0,
      dateCreated: 0,
      confirmationNumber: 0,
      customerId: 0,
    },
    customer: {
      name: "",
      address: "",
      phone: "",
      email: "",
      ccNumber: "",
      ccExpiryMonth: 0,
      ccExpiryYear: 0,
    },
    cart: [],
  };
  React.useEffect(() => {
    const initOrderString = sessionStorage.getItem(ORDER_DETAIL_STORAGE_KEY);
    if (initOrderString !== null) {
      const orderFromStorage = JSON.parse(initOrderString);
      setOrderDetails(orderFromStorage);
    }
  }, [sessionStorage.getItem(ORDER_DETAIL_STORAGE_KEY)]);
  const [orderDetails, setOrder] = React.useState(temporderDetails);

  const setOrderDetails = (order: OrderDetails) => {
    // const newOrder: OrderDetails = order;
    // Object.assign(order, orderDetails);
    setOrder(order);
    sessionStorage.setItem(ORDER_DETAIL_STORAGE_KEY, JSON.stringify(order));
  };
  const clearOrderDetails = () => {
    sessionStorage.removeItem(ORDER_DETAIL_STORAGE_KEY);
    const orders = {} as OrderDetails;
    setOrder(orders);
  };
  const hasOrderDetails = () => {
    return sessionStorage.getItem(ORDER_DETAIL_STORAGE_KEY) !== null;
  };

  return (
    <OrderContext.Provider
      value={{
        orderDetails,
        setOrderDetails,
        hasOrderDetails,
        clearOrderDetails,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
