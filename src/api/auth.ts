/**
 * Centralise les appels à l'API d'authentification et du compte utilisateur.
 * Définit leurs contrats et expose l'inscription, la connexion, le renouvellement
 * de session, la consultation/modification du profil, la suppression du compte
 * et la déconnexion.
 */

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

export interface UserProfile {
  email: string
  firstname: string
  gender: Gender
  created_at: string
  updated_at: string
}

export type UpdateProfilePayload = Pick<UserProfile, 'email' | 'firstname' | 'gender'>

export const registerUser = async (payload: RegisterPayload): Promise<void> => {
  await apiClient.post('/auth/register/', payload, { skipAuthRefresh: true })
}

export const loginUser = async (payload: LoginPayload): Promise<AccessTokenResponse> => {
  const response = await apiClient.post<AccessTokenResponse>('/auth/token/', payload, {
    skipAuthRefresh: true,
  })

  return response.data
}

export const refreshAccessToken = async (): Promise<AccessTokenResponse> => {
  const response = await apiClient.post<AccessTokenResponse>('/auth/token/refresh/', undefined, {
    skipAuthRefresh: true,
  })

  return response.data
}

export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/users/me/')
  return response.data
}

export const updateCurrentUser = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  const response = await apiClient.patch<UserProfile>('/users/me/', payload)
  return response.data
}

export const deleteCurrentUser = async (): Promise<void> => {
  await apiClient.delete('/users/me/')
}

export const logoutUser = async (): Promise<void> => {
  await apiClient.post('/auth/token/blacklist/', undefined, { skipAuthRefresh: true })
}
