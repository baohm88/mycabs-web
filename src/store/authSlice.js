// import { createSlice } from "@reduxjs/toolkit";

// const saved = JSON.parse(localStorage.getItem("auth") || "null");

// const slice = createSlice({
//     name: "auth",
//     initialState: saved || {
//         token: null,
//         role: null,
//         user: null,
//         driver: null,
//         company: null,
//     },
//     reducers: {
//         setAuth(state, { payload }) {
//             const { accessToken, profile } = payload;
//             state.token = accessToken || payload.token;
//             state.user = profile?.user || payload.user || null;
//             state.driver = profile?.driver || payload.driver || null;
//             state.company = profile?.company || payload.company || null;
//             state.role = state.user?.role || null;
//             localStorage.setItem("auth", JSON.stringify(state));
//         },
//         setCredentials(state, { payload }) {
//             // backward compat if you still call this
//             state.token = payload;
//             localStorage.setItem("auth", JSON.stringify(state));
//         },
//         logout() {
//             localStorage.removeItem("auth");
//             return {
//                 token: null,
//                 role: null,
//                 user: null,
//                 driver: null,
//                 company: null,
//             };
//         },
//     },
// });

// export const { setAuth, setCredentials, logout } = slice.actions;
// export default slice.reducer;


// UPDATED: add isAuthenticated so UI can switch between Avatar dropdown and Login button
import { createSlice } from "@reduxjs/toolkit";

const saved = JSON.parse(localStorage.getItem("auth") || "null");

const initial = {
  token: null,
  role: null,
  user: null,
  driver: null,
  company: null,
  // NEW: central flag for UI
  isAuthenticated: false,
};

const slice = createSlice({
  name: "auth",
  initialState: saved ? { ...initial, ...saved, isAuthenticated: !!saved.token } : initial,
  reducers: {
    setAuth(state, { payload }) {
      const { accessToken, profile } = payload || {};
      state.token = accessToken || payload?.token || null;
      state.user = profile?.user || payload?.user || null;
      state.driver = profile?.driver || payload?.driver || null;
      state.company = profile?.company || payload?.company || null;
      state.role = state.user?.role || null;
      state.isAuthenticated = !!state.token; // NEW
      localStorage.setItem("auth", JSON.stringify(state));
    },
    setCredentials(state, { payload }) {
      // backward compat if somewhere still calls setCredentials(token)
      state.token = payload || null;
      state.isAuthenticated = !!state.token; // NEW
      localStorage.setItem("auth", JSON.stringify(state));
    },
    logout() {
      localStorage.removeItem("auth");
      return { ...initial }; // NEW: ensures isAuthenticated=false
    },
  },
});

export const { setAuth, setCredentials, logout } = slice.actions;
export default slice.reducer;