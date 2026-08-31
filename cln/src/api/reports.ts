import { apiClient } from "./client";

export interface ReportFilterParams {
    startDate?: string;
    endDate?: string;
    education?: string;
    search?: string;
}

export interface StudentReportData {
  userId: number;
  username: string;
  fullName: string;
  university: string;
  faculty: string;
  completedSessions: number;
  totalSessions: number;
  averageScore: number;
  averageAttempts: number;
  lastActiveAt?: string;
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