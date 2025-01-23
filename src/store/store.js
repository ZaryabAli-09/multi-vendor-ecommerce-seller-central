import { configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage"; // defaults to localStorageimport productsFeedReducer from "../features/productsFeed/productsFeedSlice.js";
import authReducers from "./authReducers";

const persistConfig = {
  key: "root",
  storage,
};
const persistedAuthReducer = persistReducer(persistConfig, authReducers);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Properly assigning the reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export { store };
