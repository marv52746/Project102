import { configureStore } from "@reduxjs/toolkit";
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
import storage from "redux-persist/lib/storage"; // Default storage for web
import { thunk } from "redux-thunk"; // Import Redux Thunk

import userReducer from "./slices/userSlice";
// import notificationReducer from "./slices/notificationSlice";
// import orderListSlice from "./slices/orderListSlice";
// import saleListSlice from "./slices/saleListSlice";
// import customerSlice from "./slices/customerSlice";
// import productListSlice from "./slices/productListSlice";
// import themeSlice from "./slices/themeSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Create a function to dynamically create persisted reducers
const createPersistedReducer = (reducer) =>
  persistReducer(persistConfig, reducer);

// Configure the store
const store = configureStore({
  reducer: {
    user: createPersistedReducer(userReducer),
    // orderList: createPersistedReducer(orderListSlice),
    // saleList: createPersistedReducer(saleListSlice),
    // customerList: createPersistedReducer(customerSlice),
    // productList: createPersistedReducer(productListSlice),
    // notification: notificationReducer,
    // theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunk),
});

// Create a persistor
export const persistor = persistStore(store);

export default store;
