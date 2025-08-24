import api from './axios'

export async function login(credentials){
  const res = await api.post('/api/auth/login', credentials)
  // Expect { accessToken, profile }
  return res.data?.data
}

export async function getMe(){
  const res = await api.get('/api/auth/me')
  return res.data?.data
}

export async function updateAccount(payload){
  const res = await api.put('/api/account', payload)
  return res.data?.data
}