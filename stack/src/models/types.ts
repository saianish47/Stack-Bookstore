// Contains all the custom types we want to use for our application
export interface BookItem {
  book_id: number;
  title: string;
  author: string;
  price: number;
  is_public: boolean;
}

export interface CategoryItem {
  category_id: number;
  name: string;
}

export interface staffItem {
  book_id: number;
  title: string;
  author: string;
}

export interface CustomerForm {
  name: string;
  address: string;
  phone: string;
  email: string;
  ccNumber: string;
  ccExpiryMonth: number;
  ccExpiryYear: number;
}

export interface Order {
  orderId: number;
  amount: number;
  dateCreated: number;
  confirmationNumber: number;
  customerId: number;
}

export interface OrderDetails {
  order: Order;
  customer: CustomerForm;
  cart: cartItem[];
}

export interface cartItem {
  book: BookItem;
  quantity: number;
}
// export interface CustomerForm {
//   name: string;
//   address: string;
//   phone: string;
//   email: string;
//   ccNumber: string;
//   ccExpiryMonth: number;
//   ccExpiryYear: number;
// }

// export interface Order {
//   orderId: number;
//   amount: number;
//   dateCreated: number;
//   confirmationNumber: number;
//   customerId: number;
// }

// export interface OrderDetails {
//   order: Order;
//   customer: CustomerForm;
//   books: BookItem[];
// }

const PriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const asDollarsAndCents = function (cents: number) {
  return PriceFormatter.format(cents / 100.0);
};
