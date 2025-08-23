import { createSlice } from "@reduxjs/toolkit";

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

function getRoleFromClaims(claims) {
    if (!claims) return null;
    return (
        claims["role"] ||
        claims[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        null
    );
}

const savedToken = localStorage.getItem("accessToken");
const claims = savedToken ? parseJwt(savedToken) : null;

const initialState = {
    token: savedToken || null,
    userId: claims?.sub || claims?.nameid || null,
    email: claims?.email || null,
    role: getRoleFromClaims(claims) || "User",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, { payload }) {
            const token = payload;
            state.token = token;
            const c = parseJwt(token);
            state.userId = c?.sub || c?.nameid || null;
            state.email = c?.email || null;
            state.role = getRoleFromClaims(c) || "User";
            localStorage.setItem("accessToken", token);
        },
        logout(state) {
            state.token = null;
            state.userId = null;
            state.email = null;
            state.role = "User";
            localStorage.removeItem("accessToken");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
