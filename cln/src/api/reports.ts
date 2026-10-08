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
  attemptedExercises?: number;
  passedExercises?: number;
  totalExercises?: number;
  completedSessions: number;
  totalSessions: number;
  averageScore: number;
  averageAttempts: number;
  totalRuns?: number;
  totalSubmissions?: number;
  passedSubmissions?: number;
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
  attemptedStudents?: number;
  totalStudents?: number;
  passedStudents?: number;
  avgScore?: number;
  successRate: number;
  passRateAttempted?: number;
  passRateOverall?: number;
  averageAttempts: number;
  avgRuns?: number;
  avgSubmits?: number;
  totalRuns?: number;
  totalSubmits?: number;
  hintUsageRate: number;
  avgTimeSpentMinutes: number;
  expectedTimeMinutes: number;
}

export interface ExerciseStudentItem {
  userId: number;
  username: string;
  fullName: string;
  university: string;
  faculty: string;
  isAttempted: boolean;
  status: 'PASSED' | 'FAILED' | 'NOT_SUBMITTED';
  bestScore: number | null;
  hasUsedHint?: boolean;
  runCount: number;
  submitCount: number;
  totalAttempts: number;
  lastSubmittedAt: string | null;
  latestActivity: StudentActivityItem | null;
}

export interface ExerciseStudentBreakdownResponse {
  exercise: {
    exerciseId: number;
    title: string;
    topic: string;
    objective: string;
    difficultyLevel: number;
    expectedTime: number;
    hint: string;
  };
  stats: {
    totalStudents: number;
    attemptedCount: number;
    passedCount: number;
    passRateAttempted: number;
    passRateOverall: number;
    totalRuns: number;
    totalSubmits: number;
    avgRuns: number;
    avgSubmits: number;
    avgScore: number;
    hintUsedCount?: number;
    hintUsageRate?: number;
  };
  students: ExerciseStudentItem[];
}

export const getStudentPerformanceReport = async (params?: ReportFilterParams) => {
  const response = await apiClient.get<StudentReportData[]>("/reports/students", { params });
  return response.data;
};

export const getExerciseAnalyticsReport = async (params?: ReportFilterParams) => {
    const response = await apiClient.get<ExerciseAnalyticsData[]>("/reports/exercises", { params });
    return response.data;
};

export const getExerciseStudentBreakdown = async (exerciseId: number, params?: ReportFilterParams) => {
  const response = await apiClient.get<ExerciseStudentBreakdownResponse>(
    `/reports/exercises/${exerciseId}/students`,
    { params }
  );
  return response.data;
};

export interface ErrorAnalyticsData {
  errorType: string;
  occurrenceCount: number;
  percentage: number;
  commonExceptionMessage: string;
}

export interface StudentExerciseExceptionDetail {
  exerciseId: number;
  title: string;
  topic?: string;
  totalExceptions: number;
  errorTypes: Record<string, number>;
  latestActivity?: StudentActivityItem;
}

export interface StudentExceptionSummary {
  userId: number;
  username: string;
  fullName: string;
  university: string;
  faculty: string;
  totalExceptions: number;
  exercises: StudentExerciseExceptionDetail[];
}

export interface ErrorReportResponse {
  totalSystemExceptions: number;
  totalAffectedStudents: number;
  topErrorType: string;
  errorTypeDistribution: ErrorAnalyticsData[];
  studentExceptions: StudentExceptionSummary[];
}

export const getErrorAnalyticsReport = async (params?: ReportFilterParams) => {
    const response = await apiClient.get<ErrorReportResponse>("/reports/errors", params ? { params } : undefined);
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
  } | null;
  totalExercises: number;
  stats?: StudentActivitiesStats;
  activities: StudentActivityItem[];
}

export const getStudentActivities = async (userId: number) => {
  const response = await apiClient.get<StudentActivitiesResponse>(`/reports/students/${userId}/activities`);
  return response.data;
};