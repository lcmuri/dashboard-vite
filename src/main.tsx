import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices/index.ts";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

const store = configureStore({ reducer: rootReducer, devTools: true });

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
