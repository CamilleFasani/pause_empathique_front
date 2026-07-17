import axios from 'axios'

const apiRootUrl = import.meta.env.VITE_API_URL
if (!apiRootUrl) {
  throw new Error('VITE_API_URL is not defined')
}

export const apiClient = axios.create({
  baseURL: `${apiRootUrl.replace(/\/$/, '')}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})
