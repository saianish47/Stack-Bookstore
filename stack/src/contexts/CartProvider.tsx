/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from "react";
import useUser from "../hooks/useUser";
import { ShoppingCart } from "../models/ShoppingCart";
import {
  asDollarsAndCents,
  BookItem,
  CustomerForm,
  OrderDetails,
} from "../models/types";

import { OrderContext } from "./OrderProvider";
import axios from "axios";

const CART_STORAGE_KEY = "ShoppingCart";

interface CartProviderProps {
  children: React.ReactNode;
}

interface CartContextValue {
  cart: ShoppingCart;
  addToCart: (book: BookItem) => void;
  updateBookQuantity: (book: BookItem, quantity: number) => void;
  clearCart: (action?: string) => void;
  placeOrder: (customerForm: CustomerForm) => Promise<void>;
  count: number;
  setCount: (count: number) => void;
}

const CartContext = React.createContext<CartContextValue>({
  cart: new ShoppingCart(),
  addToCart: () => {},
  updateBookQuantity: () => {},
  clearCart: () => {},
  placeOrder: () => Promise.resolve(),
  count: 0,
  setCount: () => {},
});
const initialCart = new ShoppingCart();
const cartString = sessionStorage.getItem(CART_STORAGE_KEY);
if (cartString) {
  const cartFromStorage = JSON.parse(cartString) as ShoppingCart;
  Object.assign(initialCart, cartFromStorage);
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const orderStore = React.useContext(OrderContext);

  const [cart, setCart] = useState(initialCart);
  const [count, setCount] = useState(0);

  const { user } = useUser();
  React.useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        const url = "/api/cart";
        const token = user && (await user.getIdToken());
        const myCart = await axios
          .get(url, { headers: { authtoken: token } })
          .then((res) => res.data);
        if (myCart.itemArray) {
          myCart.itemArray.map((item: { book: BookItem; quantity: number }) => {
            const { book, quantity } = item;
            for (let i = 0; i < quantity; i++) {
              cart.addBook(book);
              setCart(cart);
              setCount(cart.numberOfItems);
              sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
            }
          });
        } else {
          console.log("No cart for user");
        }
      }
    };

    fetchCart();
  }, [user]);

  const sendCart = async (book: BookItem, quantity: number) => {
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
  };
  const deleteApi = async () => {
    if (user) {
      const url = "/api/cart";
      const token = user && (await user.getIdToken());
      await axios.delete(url, { headers: { authtoken: token } });
    }
  };

  const clearCart = (action?: string) => {
    cart.clear();
    setCart(cart);
    setCount(0);
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    if (!action) {
      deleteApi();
    }
  };

  const addToCart = (book: BookItem) => {
    cart.addBook(book);
    setCart(cart);
    setCount(cart.numberOfItems);
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    sendCart(book, 1);
  };

  const updateBookQuantity = (book: BookItem, quantity: number) => {
    cart.update(book, quantity);
    setCart(cart);
    setCount(cart.numberOfItems);
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    sendCart(book, quantity);
  };

  const placeOrder = async (customerForm: CustomerForm) => {
    const amount = asDollarsAndCents(cart.subtotal + cart.surcharge);
    const order = { cart: cart, customerForm: customerForm, amount: amount };
    orderStore.clearOrderDetails();

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
        clearCart();
        return response.json();
      }
    });
    if (!orderDetails) {
      console.error(`Error occured: ${orderDetails}`);
    }
    orderStore.setOrderDetails(orderDetails);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        count,
        clearCart,
        addToCart,
        updateBookQuantity,
        placeOrder,
        setCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
