import axios, { type AxiosError } from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean
    _retry?: boolean
  }
}

const apiRootUrl = import.meta.env.VITE_API_URL
if (!apiRootUrl) {
  throw new Error('VITE_API_URL is not defined')
}

export const apiClient = axios.create({
  baseURL: `${apiRootUrl.replace(/\/$/, '')}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

interface AuthInterceptorOptions {
  getAccessToken: () => string | null
  onAccessTokenRefreshed: (accessToken: string) => void
  onAuthFailure: () => void
}

interface AccessTokenResponse {
  access: string
}

let refreshPromise: Promise<string> | null = null

export const configureAuthInterceptors = ({
  getAccessToken,
  onAccessTokenRefreshed,
  onAuthFailure,
}: AuthInterceptorOptions) => {
  apiClient.interceptors.request.use((config) => {
    const accessToken = getAccessToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  })

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.skipAuthRefresh
      ) {
        throw error
      }

      originalRequest._retry = true

      try {
        refreshPromise ??= apiClient
          .post<AccessTokenResponse>('/auth/token/refresh/', undefined, {
            skipAuthRefresh: true,
          })
          .then((response) => {
            const accessToken = response.data.access
            onAccessTokenRefreshed(accessToken)

            return accessToken
          })
          .finally(() => {
            refreshPromise = null
          })

        const accessToken = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        onAuthFailure()
        throw refreshError
      }
    },
  )
}
