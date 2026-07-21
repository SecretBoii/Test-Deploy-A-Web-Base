export interface DifficultyMetadata {
  label: string;
  description: string;
  color: string;
  bg: string;
  border: string;
}

export const DIFFICULTY_LEVELS: Record<number, DifficultyMetadata> = {
  1: {
    label: 'Remembering & Understanding',
    description: 'การระลึกข้อมูล ข้อเท็จจริง และอธิบายหลักการหรือทำความเข้าใจคอนเซ็ปต์เบื้องต้น',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
  2: {
    label: 'Applying',
    description: 'การนำความรู้หรือสูตรการคำนวณมาแก้ปัญหาพื้นฐานทั่วไป',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
  },
  3: {
    label: 'Analyzing',
    description: 'การจำแนกแยกแยะข้อมูล วิเคราะห์เงื่อนไข หรือกระบวนการวนซ้ำในระบบ',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  4: {
    label: 'Evaluating',
    description: 'การตรวจสอบ ประเมินความถูกต้อง ตลอดจนการจัดการเคสที่มีเงื่อนไขซับซ้อน',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
  5: {
    label: 'Creating',
    description: 'การสร้าง อัลกอริทึม ฟังก์ชันซับซ้อน หรือแก้ไขปัญหาในรูปแบบโครงสร้างใหม่',
    color: '#e11d48',
    bg: '#fff1f2',
    border: '#fecdd3',
  },
};
