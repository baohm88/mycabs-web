import api from "./axios";

export async function getCompanies(params) {
    return (await api.get("/api/companies", { params })).data?.data;
}

export async function getCompany(id) {
    return (await api.get(`/api/companies/${id}`)).data?.data;
}

export async function addCompanyService(id, payload) {
    // payload: { type, title, basePrice }
    return (await api.post(`/api/companies/${id}/services`, payload)).data
        ?.data;
}

export async function getCompanyWallet(id) {
    return (await api.get(`/api/companies/${id}/wallet`)).data?.data;
}

export async function getCompanyTransactions(id, params) {
    return (await api.get(`/api/companies/${id}/transactions`, { params })).data
        ?.data;
}

export async function topupCompanyWallet(id, payload) {
    // payload: { amount, note }
    return (await api.post(`/api/companies/${id}/wallet/topup`, payload)).data
        ?.data;
}

export async function payCompanySalary(id, payload) {
    // payload: { driverId, amount, note }
    return (await api.post(`/api/companies/${id}/pay-salary`, payload)).data
        ?.data;
}

export async function payCompanyMembership(id, payload) {
    // payload: { plan, billingCycle, amount, note }
    return (await api.post(`/api/companies/${id}/membership/pay`, payload)).data
        ?.data;
}

export async function getCompanyApplications(id, params) {
    return (await api.get(`/api/companies/${id}/applications`, { params })).data
        ?.data;
}

export async function approveApplication(id, appId) {
    return (
        await api.post(`/api/companies/${id}/applications/${appId}/approve`)
    ).data?.data;
}

export async function rejectApplication(id, appId) {
    return (await api.post(`/api/companies/${id}/applications/${appId}/reject`))
        .data?.data;
}

export async function createInvitation(id, payload) {
    // payload: { email, note } (adjust to your DTO if different)
    return (await api.post(`/api/companies/${id}/invitations`, payload)).data
        ?.data;
}

export async function getInvitations(id, params) {
    return (await api.get(`/api/companies/${id}/invitations`, { params })).data
        ?.data;
}
