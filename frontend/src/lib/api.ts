import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gymai_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('gymai_token')
      localStorage.removeItem('gymai_user')
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname !== '/login') {
        // let AuthContext handle redirect; avoid hard reload loops on the login page itself
      }
    }
    return Promise.reject(error)
  }
)

export default api
