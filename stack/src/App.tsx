import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Category from "./pages/Category";
import React from "react";
import NotFound from "./pages/NotFound";
import CategoryProvider from "./contexts/CategoryProvide";
import { CartProvider } from "./contexts/CartProvider";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Confirmation } from "./pages/Confirmation";
import { OrderProvider } from "./contexts/OrderProvider";

function App() {
  return (
    <CategoryProvider>
      <OrderProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="App">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:categoryName" element={<Category />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </OrderProvider>
    </CategoryProvider>
  );
}

export default App;
