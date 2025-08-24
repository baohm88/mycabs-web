import api from './axios'

export async function getOpenings(params){
  return (await api.get('/api/drivers/openings', { params })).data?.data
}

export async function applyToOpening(payload){
  // payload: { openingId?, companyId?, note? } — tuỳ DTO backend
  return (await api.post('/api/drivers/apply', payload)).data?.data
}

export async function respondInvitation(inviteId, accept){
  // body có thể là { accept } hoặc { action: 'accept'|'reject' } — FE gửi { accept }
  return (await api.post(`/api/drivers/invitations/${inviteId}/respond`, { accept })).data?.data
}

export async function getMyWallet(){
  return (await api.get('/api/drivers/me/wallet')).data?.data
}

export async function getMyTransactions(params){
  return (await api.get('/api/drivers/me/transactions', { params })).data?.data
}

export async function getMyApplications(params){
  return (await api.get('/api/drivers/me/applications', { params })).data?.data
}

export async function getMyInvitations(params){
  return (await api.get('/api/drivers/me/invitations', { params })).data?.data
}