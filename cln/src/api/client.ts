import axios from 'axios';

// กำหนด API Base URL โดยตรวจจับสภาพแวดล้อมอัตโนมัติ
// หากเป็น Production ให้ใช้ Relative Path '/api' เสมอ (ส่งผ่าน Nginx Reverse Proxy) เพื่อป้องกันการเผลอเรียก localhost:3000 จากเครื่องผู้ใช้
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:3000');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});