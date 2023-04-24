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
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "userDetails", "orders"],
};

const rootReducer = combineReducers({
  books: BookSlice,
  category: CategorySlice,
  stafflist: StaffSlice,
  cart: CartSlice,
  userDetails: UserSlice,
  orders: OrdersSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
