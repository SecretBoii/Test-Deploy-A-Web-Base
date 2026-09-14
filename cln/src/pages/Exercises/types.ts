export interface Exercise {
  exerciseId: number
  title: string
  description: string
  topic: string
  objective: string
  difficultyLevel: number
  expectedTime: number
  status: string
  hint: string
}

export type SortField = 'id' | 'bloom'
export type SortOrder = 'asc' | 'desc'
