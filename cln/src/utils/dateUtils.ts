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
 * แปลงวันที่จากรูปแบบ ISO/DB (YYYY-MM-DD หรือ ISO Timestamp) เป็น วัน/เดือน/ปี (DD/MM/YYYY) สำหรับแสดงผลบน UI
 * @param dateStr สตริงวันที่ในรูปแบบ YYYY-MM-DD หรือ ISO String
 * @param fallback ข้อความสำรองหากวันที่ว่างเปล่า (ค่าเริ่มต้นคือ '')
 */
export const formatDisplayDate = (dateStr?: string, fallback = ''): string => {
  if (!dateStr) return fallback
  try {
    if (dateStr.includes('T')) {
      const d = new Date(dateStr)
      if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = d.getFullYear()
        return `${day}/${month}/${year}`
      }
    }
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      return `${parts[2].slice(0, 2)}/${parts[1]}/${parts[0]}`
    }
  } catch {
    return fallback
  }
  return dateStr
}

/**
 * แปลงเวลาจากรูปแบบ ISO/DB เป็น เวลาภาษาไทย (HH:mm น.) สำหรับแสดงผลบน UI
 * @param dateStr สตริงวันที่ในรูปแบบ ISO Timestamp
 * @param fallback ข้อความสำรองหากไม่มีข้อมูล (ค่าเริ่มต้นคือ '-')
 */
export const formatDisplayTime = (dateStr?: string, fallback = '-'): string => {
  if (!dateStr) return fallback
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return fallback
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${h}:${m} น.`
  } catch {
    return fallback
  }
}

/**
 * แปลงวันและเวลาจากรูปแบบ ISO/DB เป็น วัน/เดือน/ปี เวลา (DD/MM/YYYY HH:mm น.)
 */
export const formatDisplayDateTime = (dateStr?: string, fallback = '-'): string => {
  if (!dateStr) return fallback
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return fallback
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} ${h}:${m} น.`
  } catch {
    return fallback
  }
}

/**
 * แปลงวันและเวลาจากรูปแบบ ISO/DB เป็นวันที่และเวลาภาษาไทยแบบย่อ (เช่น "28 ก.ย. 69 21:20 น.")
 */
export const formatThaiDateTime = (dateStr?: string, fallback = '-'): string => {
  if (!dateStr) return fallback
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return fallback
    return `${d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })} ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`
  } catch {
    return fallback
  }
}


