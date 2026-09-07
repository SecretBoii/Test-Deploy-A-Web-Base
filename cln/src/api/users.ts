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
    page?: number;
    limit?: number;
}

export interface UserStats {
    total: number;
    onlineCount: number;
    studentCount: number;
    teacherCount: number;
}

export interface GetUsersResponse {
    data: User[];
    total: number;
    stats?: UserStats;
    page?: number;
    limit?: number;
    totalPages?: number;
}

export const getUsers = async (params: UserFilterParams): Promise<GetUsersResponse> => {
    const response = await apiClient.get<GetUsersResponse | User[]>("/users", { params });
    // ป้องกันกรณีที่ Backend คืนค่าเป็น Array แบบเดิม โดยเพิ่ม client-side pagination fallback
    if (Array.isArray(response.data)) {
        const total = response.data.length;
        const onlineCount = response.data.filter((u) => u.isOnline).length;
        const studentCount = response.data.filter((u) => u.roleId === 1).length;
        const teacherCount = response.data.filter((u) => u.roleId === 2 || u.roleId === 3).length;
        const page = params.page || 1;
        const limit = params.limit || 10;
        const start = (page - 1) * limit;
        const slicedData = response.data.slice(start, start + limit);
        return {
            data: slicedData,
            total,
            stats: {
                total,
                onlineCount,
                studentCount,
                teacherCount,
            },
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
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