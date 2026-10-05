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
  sessionName?: string;
  sessionObjective?: string;
}

// ================== ส่วนเพิ่มสำหรับ Teacher ==================
export interface SessionExerciseItem {
  exerciseId: number;
  title: string;
  topic: string;
  difficultyLevel: number;
  expectedTime: number;
  sequenceOrder: number;
  status: string;
}

export interface TeacherSessionItem {
  sessionId: number;
  sessionName: string;
  sessionObjective: string;
  targetLevel: number;
  duration: number;
  status: 'active' | 'inactive';
  exerciseCount: number;
  createdAt: string;
  updatedAt: string;
  exercises?: SessionExerciseItem[];
}

export type SessionSortField = 'id' | 'level' | 'duration' | 'name';
export type SessionSortOrder = 'asc' | 'desc';

export interface SessionFormData {
  sessionName: string;
  sessionObjective: string;
  targetLevel: number;
  duration: number;
  status: string;
  exerciseIds: number[];
}

