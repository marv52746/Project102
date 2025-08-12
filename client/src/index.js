import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import "./styles/tree.css";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./core/services/store.js";
import { HashRouter } from "react-router-dom";
import AllRoutes from "./routes/routes.js";
import { base_path } from "./environment.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter basename={base_path}>
          <AllRoutes />
        </HashRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
