import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Category from "./pages/Category";
import React, { useEffect } from "react";
import NotFound from "./pages/NotFound";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Confirmation } from "./pages/Confirmation";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import { Account } from "./components/Account";
import { Orders } from "./components/Orders";
import { OrderDetailsComponent } from "./components/OrderDetailsComponent";
import { useAppDispatch } from "./hooks";
import { getCategory } from "./slice/CategorySlice";
import { fetchStaffList } from "./slice/StaffSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { resetUserDetails, setUserDetails } from "./slice/UserSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategory());
    dispatch(fetchStaffList());

    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        dispatch(
          setUserDetails({
            email: user.email?.toString() ?? "",
            displayName: user.displayName?.toString() ?? "",
            photoUrl: user.photoURL?.toString() ?? "",
          })
        );
      } else {
        dispatch(resetUserDetails());
      }
    });

    return unsubscribe;
  }, []);
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryName" element={<Category />} />
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
  );
}

export default App;
