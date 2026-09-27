/**
 * ฟังก์ชันจัดการรูปแบบวันที่ส่วนกลางของระบบ (Centralized Date Utility Functions)
 * ใช้จัดการแปลงและจัดรูปแบบวันที่ให้สอดคล้องกันทั่วทั้ง Frontend
 */

/**
 * คำนวณวันปัจจุบันรูปแบบ YYYY-MM-DD ตามเวลาท้องถิ่น
 * ใช้เป็น Default Value สำหรับ API Parameters และ HTML Date Input
 */
export const getTodayStr = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * แปลงวันที่จากรูปแบบ ISO/DB (YYYY-MM-DD) เป็น วัน/เดือน/ปี (DD/MM/YYYY) สำหรับแสดงผลบน UI
 * @param dateStr สตริงวันที่ในรูปแบบ YYYY-MM-DD
 * @param fallback ข้อความสำรองหากวันที่ว่างเปล่า (ค่าเริ่มต้นคือ '')
 */
export const formatDisplayDate = (dateStr?: string, fallback = ''): string => {
  if (!dateStr) return fallback
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  return dateStr
}
