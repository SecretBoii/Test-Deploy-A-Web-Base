import { apiClient } from "./client";

export interface UserEducation {
    university: string;
    faculty: string;
    major: string;
}

export interface UserRole {
    roleId: number;
    roleName: string;
}

export interface User {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  registerTimestamp: string;
  roleId: number;
  role: UserRole;
  education: UserEducation;
  isOnline: boolean;
  lastActiveAt?: string;
}

export interface UserFilterParams {
    search?: string;
    roleId?: number;
    status?: string;
}

export const getUsers = async (params:UserFilterParams) => {
    const response = await apiClient.get<User[]>("/users", { params });
    return response.data;
}

export const getUserById = async (id: number) => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
}

export const createUser = async (data: Omit<User, 'userId' | 'registerTimestamp' | 'role' | 'education'>) => {
    const response = await apiClient.post<User>(`/users`, data);
    return response.data;
}

export const updateUser = async (id: number, data: Partial<Omit<User, 'userId' | 'role' | 'registerTimestamp' | 'isOnline'>> & { password?: string }) => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
}

export const deleteUser = async (id: number) => {
  const response = await apiClient.delete<{ success: boolean; message: string }>(`/users/${id}`);
  return response.data;
}