import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || '' })

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('accessToken')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // UPDATED: KHÔNG redirect cứng để tránh vòng lặp refresh khi đang ở trang cần auth
      // location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api