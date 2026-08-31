import { apiClient } from './client'
import type { AxiosResponse } from 'axios'

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

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
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

export const getPauses = async (): Promise<PauseResponse[]> => {
  const response = await apiClient.get<PaginatedResponse<PauseResponse>>('/pauses/')

  return response.data.results
}

export const getAllPauses = async (): Promise<PauseResponse[]> => {
  const pauses: PauseResponse[] = []
  let nextPageUrl: string | null = '/pauses/'

  while (nextPageUrl) {
    const response: AxiosResponse<PaginatedResponse<PauseResponse>> =
      await apiClient.get<PaginatedResponse<PauseResponse>>(nextPageUrl)

    pauses.push(...response.data.results)
    nextPageUrl = response.data.next
  }

  return pauses
}

export const getPause = async (id: number): Promise<PauseResponse> => {
  const response = await apiClient.get<PauseResponse>(`/pauses/${id}/`)
  return response.data
}

export const deletePause = async (id: number): Promise<void> => {
  await apiClient.delete(`/pauses/${id}/`)
}

export const countAnonymousPractice = async (): Promise<void> => {
  await apiClient.post('/pauses/anonymous/')
}
