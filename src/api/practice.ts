import { apiClient } from './client'

export interface Feeling {
  id: number
  family: string
  names: {
    f: string
    m: string
  }
}

export interface Need {
  id: number
  family: string
  name: string
}

export interface PauseCreatePayload {
  title?: string
  empty_your_bag?: string
  observation?: string
  feelings: number[]
  needs: number[]
}

export interface PauseResponse {
  id: number
  title: string
  created_at: string
  updated_at: string
  empty_your_bag: string
  observation: string
  feelings: Feeling[]
  needs: Need[]
}

export const getFeelings = async (): Promise<Feeling[]> => {
  const response = await apiClient.get<Feeling[]>('/feelings/')
  return response.data
}

export const getNeeds = async (): Promise<Need[]> => {
  const response = await apiClient.get<Need[]>('/needs/')
  return response.data
}

export const createPause = async (payload: PauseCreatePayload): Promise<PauseResponse> => {
  const response = await apiClient.post<PauseResponse>('/pauses/', payload)
  return response.data
}

export const countAnonymousPractice = async (): Promise<void> => {
  await apiClient.post('/pauses/anonymous/')
}
