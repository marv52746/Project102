import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./core/services/store.js";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./routes/routes.js";
import { base_path } from "./environment.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename={base_path}>
          <AllRoutes />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
