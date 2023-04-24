import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { OrderDetails } from "../models/types";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { RootState } from "../reducer";

interface OrderState {
  latestOrderDetails: OrderDetails;
  allOrders: OrderDetails[];
  orderError: boolean;
}

const initialState: OrderState = {
  latestOrderDetails: {
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
  },
  allOrders: [],
  orderError: false,
};

export const getAllOrders = createAsyncThunk(
  "orders/getAllOrders",
  async () => {
    const user = getAuth().currentUser;
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
        return allOrders;
      } catch (error) {
        console.error(
          `an error occured inside the My-Orders Provider ${error}`
        );
      }
    }
  }
);

const OrderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrderDetails: (state, action) => {
      if (action.payload) {
        state.latestOrderDetails = action.payload;
      } else {
        state.orderError = true;
      }
    },
    clearOrderDetails: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllOrders.fulfilled, (state, action) => {
      if (action.payload) state.allOrders = action.payload;
    });
  },
});

export const { setOrderDetails } = OrderSlice.actions;
export default OrderSlice.reducer;

export const getOrder = (id: string) =>
  createSelector(
    (state: RootState) => state.orders.allOrders,
    (myOrders) => {
      const order = myOrders.find(
        (my_order: OrderDetails) => my_order.order.orderId === id
      );
      return order;
    }
  );

// export const getTheOrders = (state: RootState) => state.orders.allOrders;

// export const getOrder = createSelector(
//   [getTheOrders, (state: RootState, orderId: string) => orderId],
//   (allOrders, orderId) => {
//     const order = allOrders.find(
//       (o: OrderDetails) => o.order.orderId === orderId
//     );
//     return order ? order : null;
//   }
// );
