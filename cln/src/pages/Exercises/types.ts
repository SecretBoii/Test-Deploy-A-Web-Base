export interface ExerciseSessionInfo {
  sessionId: number
  sessionName: string
  status?: string
}

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
  sessions?: ExerciseSessionInfo[]
}

export type ExerciseFormData = Omit<Exercise, 'exerciseId' | 'sessions'>

export type SortField = 'id' | 'bloom'
export type SortOrder = 'asc' | 'desc'
