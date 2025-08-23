import api from "./axios";

export async function getCompanies(params) {
    const res = await api.get("/api/riders/companies", { params });
    return res.data?.data;
}
export async function getDrivers(params) {
    const res = await api.get("/api/riders/drivers", { params });
    return res.data?.data;
}
export async function getRatings(params) {
    const res = await api.get("/api/riders/ratings", { params });
    return res.data?.data;
}
export async function getRatingSummary(targetType, targetId) {
    const res = await api.get("/api/riders/ratings/summary", {
        params: { targetType, targetId },
    });
    return res.data?.data;
}
export async function createRating(payload) {
    const res = await api.post("/api/riders/ratings", payload);
    return res.data?.data;
}
