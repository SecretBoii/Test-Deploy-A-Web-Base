export interface ExerciseItem {
  exerciseId: number;
  orderNumber: number;
  title: string;
  description: string;
  expectedTime: number;
  isPassed: boolean;
}

export interface SessionDetail {
  sessionId: number;
  sessionName: string;
  sessionObjective: string;
  duration: number;
  totalExercises: number;
  completedExercises: number;
  isCompleted: boolean;
  exercises: ExerciseItem[];
}

export interface LevelSummary {
  level: number;
  totalSessions: number;
  totalHours: number;
  totalExercises: number;
  completedExercises: number;
}
