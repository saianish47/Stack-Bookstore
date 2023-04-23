import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  BookItem,
  CustomerForm,
  OrderDetails,
  asDollarsAndCents,
  cartItem,
} from "../models/types";
import axios from "axios";
import { RootState } from "../reducer";
import { cartSubTotal } from "../models/types";
import { getAuth } from "firebase/auth";
import { setOrderDetails } from "./OrdersSlice";
// import { clearOrderDetails } from "./OrdersSlice";

interface CartState {
  cart: cartItem[];
}

const initialState: CartState = {
  cart: [],
};

const sendToCart = createAsyncThunk(
  "sendToCart",
  async ({ book, quantity }: { book: BookItem; quantity: number }) => {
    // const { user } = (getState() as RootState).userDetails;
    const user = getAuth().currentUser;
    if (user) {
      try {
        const { book_id } = book;
        const token = user && (await user.getIdToken());
        const res = await axios
          .post(
            "/api/cart",
            {
              cart: {
                book_id: book_id,
                quantity: quantity,
              },
            },
            { headers: { authtoken: token } }
          )
          .then((rep) => rep.data);
        if (res) {
          console.log(res);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("User not logged in");
    }
  }
);

const addBook = (book: BookItem, cart: cartItem[]): cartItem[] => {
  // const existingItemIndex = cart.findIndex(
  //   (item) => item.book.book_id === book.book_id
  // );
  const existingItemIndex =
    cart.length > 0
      ? cart.findIndex((item) => item.book.book_id === book.book_id)
      : -1;
  if (existingItemIndex >= 0) {
    // Book already exists in the cart, update its quantity
    const updatedCart = cart.map((item, index) =>
      index === existingItemIndex
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );
    return updatedCart;
  } else {
    // Book doesn't exist in the cart, add it as a new item
    const newItem = { book, quantity: 1 };
    const updatedCart = [...cart, newItem];
    return updatedCart;
  }
};

const update = (book: BookItem, quantity: number, cart: cartItem[]) => {
  let updatedCart = [...cart];
  if (quantity < 0 || quantity > 99) return;
  const existingItemIndex = cart.findIndex(
    (item) => item.book.book_id == book.book_id
  );
  if (existingItemIndex !== -1) {
    if (quantity !== 0) {
      updatedCart = cart.map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              quantity: quantity,
            }
          : item
      );
    } else {
      // remove item if quantity == 0
      updatedCart.splice(existingItemIndex, 1);
    }
  }
  return updatedCart;
};

export const addToCart = createAsyncThunk(
  "addToCart",
  async (book: BookItem, { getState, rejectWithValue, dispatch }) => {
    try {
      const { cart } = (getState() as RootState).cart;
      const updatedCart = addBook(book, cart);
      dispatch(sendToCart({ book, quantity: 1 }));
      return updatedCart;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error occurred while adding to cart");
    }
  }
);
export const updateTheCart = createAsyncThunk(
  "updateTheCart",
  async (
    { book, quantity }: { book: BookItem; quantity: number },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const { cart } = (getState() as RootState).cart;
      const updatedCart = update(book, quantity, cart);
      dispatch(sendToCart({ book, quantity }));
      return updatedCart;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error occurred while adding to cart");
    }
  }
);
export const clearCart = createAsyncThunk("clearCart", async () => {
  const user = getAuth().currentUser;
  try {
    if (user) {
      const url = "/api/cart";
      const token = user && (await user.getIdToken());
      await axios.delete(url, { headers: { authtoken: token } });
    }
  } catch (e) {
    console.log(e);
  }
});

export const fetchCart = createAsyncThunk("fetchCart", async () => {
  const user = getAuth().currentUser;
  if (user) {
    const url = "/api/cart";
    const token = user && (await user.getIdToken());
    const myCart = await axios
      .get(url, { headers: { authtoken: token } })
      .then((res) => res.data);
    return myCart;
  }
});
export const placeOrder = createAsyncThunk(
  "placeOrder",
  async (customerForm: CustomerForm, { getState, dispatch }) => {
    const { cart } = (getState() as RootState).cart;
    const subtotal = cartSubTotal(cart);
    const surcharge = 500;
    const amount = asDollarsAndCents(subtotal + surcharge);
    const order = {
      cart: cart,
      customerForm: customerForm,
      amount: amount,
    };
    const user = getAuth().currentUser;
    const url = "/api/orders";
    const token = user && (await user.getIdToken());
    const orderDetails: OrderDetails = await fetch(url, {
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        authtoken: token ? token : "",
      },
      redirect: "follow",
      referrer: "client",
      method: "POST",
      body: JSON.stringify(order),
    }).then((response) => {
      if (response.ok) {
        console.log("Order OK");
        dispatch(clearCart());
        return response.json();
      }
    });
    if (!orderDetails) {
      console.error("Error occured");
    }
    dispatch(setOrderDetails(orderDetails));
    return orderDetails;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        const updatedCart = action.payload;
        if (updatedCart) state.cart = updatedCart;
        // state.count = numberOfItems(state.cart);
        // sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
      })
      .addCase(updateTheCart.fulfilled, (state, action) => {
        const updatedCart = action.payload;
        if (updatedCart) state.cart = updatedCart;
        // state.count = numberOfItems(state.cart);
      })
      .addCase(clearCart.fulfilled, () => {
        return initialState;
      })
      .addCase(placeOrder.fulfilled, (_, action) => {
        if (!action.payload) {
          console.error(`Error occured: ${action.payload}`);
        }
      })
      .addCase(sendToCart.fulfilled, () => {
        console.log("Added to the cart");
      })
      .addCase(sendToCart.rejected, () => {
        console.log("Rejected");
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        console.log("Feteched cart");
        action.payload.itemArray && (state.cart = action.payload.itemArray);
      });
  },
});

export default cartSlice.reducer;
export const { resetCart } = cartSlice.actions;
