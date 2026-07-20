export interface DifficultyMetadata {
  label: string;
  description: string;
}

export const DIFFICULTY_LEVELS: Record<number, DifficultyMetadata> = {
  1: {
    label: 'Remembering & Understanding',
    description: 'การระลึกข้อมูล ข้อเท็จจริง และอธิบายหลักการหรือทำความเข้าใจคอนเซ็ปต์เบื้องต้น',
  },
  2: {
    label: 'Applying',
    description: 'การนำความรู้หรือสูตรการคำนวณมาแก้ปัญหาพื้นฐานทั่วไป',
  },
  3: {
    label: 'Analyzing',
    description: 'การจำแนกแยกแยะข้อมูล วิเคราะห์เงื่อนไข หรือกระบวนการวนซ้ำในระบบ',
  },
  4: {
    label: 'Evaluating',
    description: 'การตรวจสอบ ประเมินความถูกต้อง ตลอดจนการจัดการเคสที่มีเงื่อนไขซับซ้อน',
  },
  5: {
    label: 'Creating',
    description: 'การสร้าง อัลกอริทึม ฟังก์ชันซับซ้อน หรือแก้ไขปัญหาในรูปแบบโครงสร้างใหม่',
  },
};
