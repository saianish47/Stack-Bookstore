/* eslint-disable @typescript-eslint/no-empty-function */
import axios from "axios";
import React, { useContext } from "react";
import useUser from "../hooks/useUser";
import { OrderDetails } from "../models/types";
import { OrderContext } from "./OrderProvider";

interface MyOrderProviderProps {
  children: React.ReactNode;
}

interface MyOrderContextValue {
  myOrders: OrderDetails[];
  getAllOrders: () => void;
  getOrder: (id: string) => OrderDetails | undefined;
}

export const MyOrderContext = React.createContext<MyOrderContextValue>({
  myOrders: [],
  getAllOrders: () => {},
  getOrder: () => undefined,
});

export const MyOrderProvider = ({ children }: MyOrderProviderProps) => {
  const { user } = useUser();
  const { orderDetails } = useContext(OrderContext);

  const [myOrders, setMyOrders] = React.useState<OrderDetails[]>([]);
  const getAllOrders = async () => {
    const token = user && (await user.getIdToken());
    if (user) {
      try {
        const allOrders = await axios
          .get("/api/orders", {
            headers: {
              authtoken: token,
            },
          })
          .then((Response) => Response.data);
        setMyOrders(allOrders);
      } catch (error) {
        console.error(
          `an error occured inside the My-Orders Provider ${error}`
        );
      }
    }
  };

  const getOrder = (id: string) => {
    const order = myOrders.find((my_order) => my_order.order.orderId === id);
    return order;
  };

  React.useEffect(() => {
    getAllOrders();
  }, [user, orderDetails]);

  return (
    <MyOrderContext.Provider
      value={{
        myOrders,
        getAllOrders,
        getOrder,
      }}
    >
      {children}
    </MyOrderContext.Provider>
  );
};
