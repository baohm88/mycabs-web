import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "./index.css";

import App from "./App.jsx";
import { store } from "./store";
import { queryClient } from "./lib/queryClient";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <App />
            <ToastContainer position="top-right" autoClose={3000} />
            {import.meta.env.DEV ? (
                <ReactQueryDevtools initialIsOpen={false} />
            ) : null}
        </QueryClientProvider>
    </Provider>
);
