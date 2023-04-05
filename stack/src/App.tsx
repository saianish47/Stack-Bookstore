import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Category from "./pages/Category";
import React from "react";
import NotFound from "./pages/NotFound";
import CategoryProvider from "./contexts/CategoryProvider";
import { CartProvider } from "./contexts/CartProvider";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Confirmation } from "./pages/Confirmation";
import { OrderProvider } from "./contexts/OrderProvider";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import { Account } from "./components/Account";
import { Orders } from "./components/Orders";
import { MyOrderProvider } from "./contexts/MyOrderProvider";
import { OrderDetailsComponent } from "./components/OrderDetailsComponent";

function App() {
  return (
    <CategoryProvider>
      <OrderProvider>
        <MyOrderProvider>
          <CartProvider>
            <BrowserRouter>
              <div className="App">
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/category/:categoryName"
                    element={<Category />}
                  />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/confirmation" element={<Confirmation />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/create-account" element={<CreateAccount />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/my-orders">
                    <Route path="" element={<Orders />} />
                    <Route path=":id" element={<OrderDetailsComponent />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
              </div>
            </BrowserRouter>
          </CartProvider>
        </MyOrderProvider>
      </OrderProvider>
    </CategoryProvider>
  );
}

export default App;
