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

const CART_STORAGE_KEY = "ShoppingCart";

interface CartProviderProps {
  children: React.ReactNode;
}

interface CartContextValue {
  cart: ShoppingCart;
  addToCart: (book: BookItem) => void;
  updateBookQuantity: (book: BookItem, quantity: number) => void;
  clearCart: () => void;
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
  const clearCart = () => {
    cart.clear();
    setCart(cart);
    console.log(cart);
    setCount(0);
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  };
  const addToCart = (book: BookItem) => {
    cart.addBook(book);
    setCart(cart);
    setCount(cart.numberOfItems);
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  };

  const updateBookQuantity = (book: BookItem, quantity: number) => {
    cart.update(book, quantity);
    setCart(cart);
    setCount(cart.numberOfItems);
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  };

  const placeOrder = async (customerForm: CustomerForm) => {
    const amount = asDollarsAndCents(cart.subtotal + cart.surcharge);
    const order = { cart: cart, customerForm: customerForm, amount: amount };
    orderStore.clearOrderDetails();
    console.log(JSON.stringify(order, null, 2));

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
      }

      return response.json();
    });
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
