import { apiClient } from './client'

export type Gender = 'F' | 'M'

export interface RegisterPayload {
  firstname: string
  email: string
  password: string
  gender: Gender
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AccessTokenResponse {
  access: string
}

export const registerUser = async (payload: RegisterPayload): Promise<void> => {
  await apiClient.post('/auth/register/', payload)
}

export const loginUser = async (payload: LoginPayload): Promise<AccessTokenResponse> => {
  const response = await apiClient.post<AccessTokenResponse>('/auth/token/', payload)

  return response.data
}

export const refreshAccessToken = async (): Promise<AccessTokenResponse> => {
  const response = await apiClient.post<AccessTokenResponse>('/auth/token/refresh/')

  return response.data
}

export const logoutUser = async (): Promise<void> => {
  await apiClient.post('/auth/token/blacklist/')
}
