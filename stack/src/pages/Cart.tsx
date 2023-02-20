import React from "react";
import { CartTable } from "../components/CartTable";
import { CartProvider } from "../contexts/CartProvider";

function Cart() {
  return (
    <div className="cart-view">
      <CartProvider>
        <CartTable />
      </CartProvider>
    </div>
  );
}

export { Cart };
