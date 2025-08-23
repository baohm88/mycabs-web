import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || "" });

api.interceptors.request.use((cfg) => {
    const t = localStorage.getItem("accessToken");
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
    return cfg;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        // NOTE: Do not hard‑redirect on 401 to avoid reload loops
        return Promise.reject(err);
    }
);

export default api;
