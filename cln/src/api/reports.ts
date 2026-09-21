import { apiClient } from "./client";

export interface ReportFilterParams {
    startDate?: string;
    endDate?: string;
    education?: string;
    search?: string;
    timeRange?: string;
}

export interface StudentReportData {
  userId: number;
  username: string;
  fullName: string;
  university: string;
  faculty: string;
  passedExercises?: number;
  totalExercises?: number;
  completedSessions: number;
  totalSessions: number;
  averageScore: number;
  averageAttempts: number;
  totalSubmissions?: number;
  passedSubmissions?: number;
  lastActiveAt?: string;
}

export interface StudentActivityItem {
  activityId: number;
  userId: number;
  exerciseId: number;
  sessionId: number;
  startedAt: string;
  submittedAt: string;
  hintUsed: boolean;
  answer: string;
  score: number;
  status: string;
  output?: string | null;
  exceptionMessage?: string | null;
  aiFeedback?: string | null;
  eventType: 'run' | 'submit' | string;
  runCount: number;
  exercise?: {
    exerciseId: number;
    title: string;
    topic: string;
    difficultyLevel: number;
    expectedTime: number;
  };
  session?: {
    sessionId: number;
    sessionName: string;
    targetLevel?: number;
  };
}

export interface ExerciseAnalyticsData {
  exerciseId: number;
  title: string;
  topic: string;
  difficultyLevel: number;
  successRate: number;
  averageAttempts: number;
  hintUsageRate: number;
  avgTimeSpentMinutes: number;
  expectedTimeMinutes: number;
}

export interface ErrorAnalyticsData {
  errorType: string;
  occurrenceCount: number;
  percentage: number;
  commonExceptionMessage: string;
}

export const getStudentPerformanceReport = async (params: ReportFilterParams) => {
  const response = await apiClient.get<StudentReportData[]>("/reports/students", { params });
  return response.data;
};

export const getExerciseAnalyticsReport = async (params: ReportFilterParams) => {
    const response = await apiClient.get<ExerciseAnalyticsData[]>("/reports/exercises", { params });
    return response.data;
};

export const getErrorAnalyticsReport = async (params: ReportFilterParams) => {
    const response = await apiClient.get<ErrorAnalyticsData[]>("/reports/errors", { params });
    return response.data;
};

export interface StudentActivitiesStats {
  passedCount: number;
  percentage: number;
  averageScore: number;
  totalActivities: number;
  submitCount: number;
  runCount: number;
}

export interface StudentActivitiesResponse {
  student: {
    userId: number;
    username: string;
    fullName: string;
    email: string;
    university: string;
    faculty: string;
    major: string;
    lastActiveAt?: string;
  } | null;
  totalExercises: number;
  stats?: StudentActivitiesStats;
  activities: StudentActivityItem[];
}

export const getStudentActivities = async (userId: number) => {
  const response = await apiClient.get<StudentActivitiesResponse>(`/reports/students/${userId}/activities`);
  return response.data;
};