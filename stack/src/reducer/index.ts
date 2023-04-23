import { configureStore } from "@reduxjs/toolkit";
import BookSlice from "../slice/BookSlice";
import CategorySlice from "../slice/CategorySlice";
import StaffSlice from "../slice/StaffSlice";
import CartSlice from "../slice/CartSlice";
import UserSlice from "../slice/UserSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import OrdersSlice from "../slice/OrdersSlice";

const persistConfig = {
  key: "cart_storage",
  storage,
  whitelist: ["cart"],
};

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["userDetails"],
};

const orderPersistConfig = {
  key: "orders",
  storage,
  whitelist: ["orders"],
};

const persistedCartReducer = persistReducer(persistConfig, CartSlice);
const persistedUserReducer = persistReducer(userPersistConfig, UserSlice);
const persistedOrderReducer = persistReducer(orderPersistConfig, OrdersSlice);

export const store = configureStore({
  reducer: {
    books: BookSlice,
    category: CategorySlice,
    stafflist: StaffSlice,
    cart: persistedCartReducer,
    userDetails: persistedUserReducer,
    orders: persistedOrderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: [
          "userDetails.user",
          "payload",
          "meta.arg",
          "user/getUser/fulfilled",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
