import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import RefreshProvider from "./components/utils/RefreshProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <RefreshProvider>
          <App />
        </RefreshProvider>
      </NextUIProvider>
    </Provider>
  </React.StrictMode>
);
