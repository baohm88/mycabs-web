import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import ui from "./uiSlice";

export const store = configureStore({
    reducer: { auth, ui },
});
