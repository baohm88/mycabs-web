import { createSlice } from "@reduxjs/toolkit";

const saved = JSON.parse(localStorage.getItem("auth") || "null");

const initial = {
  token: null,
  role: null,
  user: null,
  driver: null,
  company: null,
  isAuthenticated: false,
};

const slice = createSlice({
  name: "auth",
  initialState: saved
    ? { ...initial, ...saved, isAuthenticated: !!saved.token }
    : initial,
  reducers: {
    // Dùng khi có { accessToken, profile } hoặc muốn cập nhật profile
    setAuth(state, { payload }) {
      const { accessToken, token, profile, user, driver, company } = payload || {};
      const t = accessToken ?? token ?? null;

      state.token = t;
      state.user = profile?.user ?? user ?? null;
      state.driver = profile?.driver ?? driver ?? null;
      state.company = profile?.company ?? company ?? null;
      state.role = state.user?.role ?? null;
      state.isAuthenticated = !!t;

      localStorage.setItem("auth", JSON.stringify(state));
      if (t) localStorage.setItem("accessToken", t);
      else localStorage.removeItem("accessToken");
    },

    // Dùng ngay sau login chỉ với token => XÓA sạch profile cũ để tránh dây dưa
    setCredentials(state, { payload }) {
      const t =
        typeof payload === "string"
          ? payload
          : payload?.accessToken ?? payload?.token ?? null;

      state.token = t;
      state.isAuthenticated = !!t;

      // reset toàn bộ profile/role cũ
      state.user = null;
      state.driver = null;
      state.company = null;
      state.role = null;

      localStorage.setItem("auth", JSON.stringify(state));
      if (t) localStorage.setItem("accessToken", t);
      else localStorage.removeItem("accessToken");
    },

    logout() {
      localStorage.removeItem("auth");
      localStorage.removeItem("accessToken"); // dọn cho axios interceptor
      return { ...initial };
    },
  },
});

export const { setAuth, setCredentials, logout } = slice.actions;
export default slice.reducer;
