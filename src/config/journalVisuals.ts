import type { Component } from 'vue'
import {
  HomeShield,
  KeyframeAlignVertical,
  BrightStar,
  Yoga,
  MultiBubble,
  Pause,
  Community,
  BirthdayCake,
} from '@iconoir/vue'

export const defaultJournalFeelingColor = '#FFDC7D'
export const defaultJournalNeedIconComponent = Pause

export const journalFeelingColors: Record<string, string> = {
  Affection: '#FFD8C7',
  Sérénité: '#DDEFD8',
  Joie: '#FFE8A3',
  Intérêt: '#D9EAF7',
  Energie: '#FFD6A5',
  Énergie: '#FFD6A5',
  Peur: '#E5D9F2',
  Colère: '#FFC9B8',
  Tristesse: '#D6E4F0',
  Confusion: '#E8E0D4',
  Fatigue: '#E7E2F3',
  Sidération: '#E2E5E1',
  Tension: '#F4D6D2',
}

export const journalNeedIconComponents: Record<string, Component> = {
  Survie: HomeShield,
  Intégrité: KeyframeAlignVertical,
  Réalisation: BrightStar,
  Harmonie: Yoga,
  Relation: MultiBubble,
  Coopération: Community,
  Célébration: BirthdayCake,
}
