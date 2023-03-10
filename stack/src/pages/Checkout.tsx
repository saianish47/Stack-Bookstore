import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartProvider";
import { CategoryContext } from "../contexts/CategoryContext";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { isMobilePhone, isCreditCard } from "../validator";
import { asDollarsAndCents } from "../models/types";
import * as Yup from "yup";

interface Myvalues {
  name: string;
  address: string;
  phone: string;
  email: string;
  ccNumber: string;
  ccExpiryMonth: 1;
  ccExpiryYear: number;
  checkoutStatus: string;
}

const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const yearFrom = (index: number) => {
  return new Date().getFullYear() + index;
};
const MyFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string()
    .required("Phone is required")
    .test("is-phone", "Invalid phone", isMobilePhone),
  email: Yup.string().email("Invalid email").required("Email is required"),
  ccNumber: Yup.string()
    .required("Credit card is required")
    .test("is-credit", "Invalid Credit Card", isCreditCard),
});

function Checkout() {
  const { cart, placeOrder } = React.useContext(CartContext);
  const { selectedCategory } = React.useContext(CategoryContext);
  const navigate = useNavigate();

  const initialValues: Myvalues = {
    name: "",
    address: "",
    phone: "",
    email: "",
    ccNumber: "",
    ccExpiryMonth: 1,
    ccExpiryYear: new Date().getFullYear(),
    checkoutStatus: "",
  };
  const [values, setvalues] = React.useState(initialValues);

  const handleSubmit = async (
    values: Myvalues,
    isValid: FormikHelpers<Myvalues>
  ) => {
    if (isValid) {
      values.checkoutStatus = "PENDING";
      await placeOrder({
        name: values.name,
        address: values.address,
        phone: values.phone,
        email: values.email,
        ccNumber: values.ccNumber,
        ccExpiryMonth: values.ccExpiryMonth,
        ccExpiryYear: values.ccExpiryYear,
      })
        .then(() => {
          values.checkoutStatus = "OK";
          navigate("/confirmation");
        })
        .catch((reason) => {
          values.checkoutStatus = "SERVER_ERROR";
          console.log("Error placing order", reason);
        });
    } else {
      values.checkoutStatus = "ERROR";
    }
    setvalues(values);
  };

  return (
    <div className="checkout-page">
      {cart.empty ? (
        <section className="empty-checkout">
          <strong className="container">
            Please add an item to your cart to checkout
          </strong>
          <Link to={`/category/${selectedCategory}`} className="sec-button sec">
            Back to Shopping
          </Link>
        </section>
      ) : (
        <section className="checkout-page-body">
          <h1 className="checkout-heading">
            Please enter the details to checkout
          </h1>
          <Formik
            initialValues={initialValues}
            validationSchema={MyFormSchema}
            onSubmit={(values, isValid) => {
              handleSubmit(values, isValid);
            }}
          >
            {({ isSubmitting }) => (
              <>
                <Form>
                  <div className="input-error">
                    <div>
                      <label htmlFor="name">Name</label>
                      <Field type="text" name="name" />
                    </div>
                    <div>
                      <ErrorMessage name="name" />
                    </div>
                  </div>
                  <div className="input-error">
                    <div>
                      <label htmlFor="address">Address</label>
                      <Field type="text" name="address" />
                    </div>
                    <div>
                      <ErrorMessage name="address" />
                    </div>
                  </div>
                  <div className="input-error">
                    <div>
                      <label htmlFor="phone">Phone</label>
                      <Field type="text" name="phone" />
                    </div>
                    <div>
                      <ErrorMessage name="phone" />
                    </div>
                  </div>
                  <div className="input-error">
                    <div>
                      <label htmlFor="email">Email</label>
                      <Field type="text" name="email" />
                    </div>
                    <div>
                      <ErrorMessage name="email" />
                    </div>
                  </div>
                  <div className="input-error">
                    <div>
                      <label htmlFor="ccNumber">Credit card</label>
                      <Field type="text" name="ccNumber" />
                    </div>
                    <div>
                      <ErrorMessage name="ccNumber" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ccExpiryMonth">Expiry Date</label>
                    <Field
                      name="ccExpiryMonth"
                      as="select"
                      className="expiry-date-select"
                    >
                      {months.map((month, index) => (
                        <option key={index} value={index + 1}>
                          {month} ({index + 1})
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="ccExpiryMonth" />
                    <Field
                      name="ccExpiryYear"
                      as="select"
                      className="expiry-date-select"
                    >
                      {Array.from({ length: 16 }, (_, i) => i).map((index) => (
                        <option key={index} value={yearFrom(index - 1)}>
                          {yearFrom(index - 1)}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="ccExpiryYear" />
                  </div>

                  <div className="submit-button">
                    <button
                      type="submit"
                      className="button"
                      disabled={isSubmitting}
                    >
                      Complete Purchase
                    </button>
                  </div>
                </Form>
              </>
            )}
          </Formik>
          <section className="checkout-details">
            Your card will be charged
            <strong>
              {asDollarsAndCents(cart.subtotal + cart.surcharge)}{" "}
            </strong>
            <br />(<strong> {asDollarsAndCents(cart.subtotal)}</strong>+
            <strong>{asDollarsAndCents(cart.surcharge)} shipping)</strong>
          </section>
          <section className="checkoutStatusBox">
            {values.checkoutStatus !== "" ? (
              values.checkoutStatus === "ERROR" ? (
                <p> Please Fix the problems and try again</p>
              ) : values.checkoutStatus === "PENDING" ? (
                <p> Processing.... </p>
              ) : values.checkoutStatus === "OK" ? (
                <p>Order Placed...</p>
              ) : (
                <p>An unexpected error occurred, please try again.</p>
              )
            ) : (
              <p> Please fill out the form</p>
            )}
          </section>
        </section>
      )}
    </div>
  );
}

export { Checkout };
